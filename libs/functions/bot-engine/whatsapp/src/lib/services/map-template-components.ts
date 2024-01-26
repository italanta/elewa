import { HandlerTools } from "@iote/cqrs";

import { MessageTemplate, 
         WhatsappNewTemplateComponent, 
         TemplateBody, 
         WhatsappBodyTemplateComponent, 
         WhatsappTemplateComponentTypes, 
         TemplateHeader, 
         WhatsappHeaderTemplateComponent, 
         WhatsappTemplateButtons, 
         WhatsappButtonsTemplateComponent, 
         TemplateHeaderTypes, 
         WhatsappMediaTemplateComponent, 
         WhatsappTextHeaderTemplateComponent, 
         isMediaHeader, 
         TextHeader} from "@app/model/convs-mgr/functions";

export function mapComponents(messageTemplate: MessageTemplate, tools: HandlerTools) 
{
  const components = Object.keys(messageTemplate.content);

  const templateComponents: WhatsappNewTemplateComponent[] = components.map((comp) =>
  {
    switch (comp) {
      case "body": {
        let rawBody = messageTemplate.content[comp] as TemplateBody;
        const parsedText = parseVariables(rawBody.text);

        let bodyComponent: WhatsappBodyTemplateComponent = {
          type: WhatsappTemplateComponentTypes.Body,
          text: parsedText.newText,
        };

        if (parsedText.varCount > 0) {
          if (parsedText.varCount === rawBody.examples.length) {
            bodyComponent.example = {
              // For some reason, whatsapp requires the examples to be inside anotehr array
              //   if they are more than one
              body_text: parsedText.varCount > 1 ? [rawBody.examples] : rawBody.examples
            }
          } else {
            tools.Logger.error(() => `Error parsing template body - Variable count mismatch`);
          }
        }
        return bodyComponent;
      }

      case "footer": {
        let footerComponent: WhatsappBodyTemplateComponent = {
          type: WhatsappTemplateComponentTypes.Footer,
          text: messageTemplate.content[comp],
        };
        return footerComponent;
      }

      case "header": {
        let rawHeader = messageTemplate.content[comp] as TemplateHeader;
        let headerComponent: WhatsappHeaderTemplateComponent = {
          format: rawHeader.type,
          type: WhatsappTemplateComponentTypes.Header,
        };

        headerComponent = mapHeaders(headerComponent, rawHeader);

        if(rawHeader.examples) {
          headerComponent = addExampleToHeader(headerComponent, rawHeader.examples[0], tools);
        }
        return headerComponent;
      }

      case "buttons": {
        let rawButtons = messageTemplate.content[comp] as WhatsappTemplateButtons[];
        let buttonsComponent: WhatsappButtonsTemplateComponent = {
          type: WhatsappTemplateComponentTypes.Buttons,
          buttons: rawButtons,
        };
        return buttonsComponent;
      }

      default:
        // Handle other cases or throw an error if needed
        return {} as WhatsappNewTemplateComponent;
    }
  });

  return templateComponents;
}

function mapHeaders(header: WhatsappHeaderTemplateComponent, template: TemplateHeader) {
  // TODO -- Add other header types
  if(template.type == TemplateHeaderTypes.TEXT) {
    const textTemplate = template as TextHeader;
    header.text = textTemplate.text;
  }
  return header;
}

function addExampleToHeader(header: WhatsappHeaderTemplateComponent, headerExample: string, tools: HandlerTools) 
{
  tools.Logger.log(() => `[ManageTemplateService]._addExampleToHeader - Adding example content to header...`);

  if (header.format == TemplateHeaderTypes.TEXT) {
    const textHeader = header as WhatsappTextHeaderTemplateComponent;
    const parsedText = parseVariables(textHeader.text);


    // Because the header only allows one variable
    if (parsedText.varCount == 1) {
      textHeader.example = {
        header_text : [headerExample]
      };
      textHeader.text = parsedText.newText;
    }

    return textHeader;
  } else if (isMediaHeader(header.format)) {
    const mediaHeader = header as WhatsappMediaTemplateComponent;

    // TODO: Use Resumable API to upload a media asset to whatsapp and 
    //  Get the handle to set here
    mediaHeader.example.header_handle = [""];
  } else {
    return header;
  }
}

function parseVariables(text: string): { newText: string; varCount: number } {
  const varExp = new RegExp(/\{\{([^}]+)\}\}/g);

  let count = 0;

  const replacedText = text.replace(varExp, (_, match) => {
    count++;
    return `{{${count.toString()}}}`;
  });

  return { newText: replacedText, varCount: count };
}