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
         isMediaHeader } from "@app/model/convs-mgr/functions";

export function mapComponents(messageTemplate: MessageTemplate, tools: HandlerTools) 
{
  const components = Object.keys(messageTemplate.content);

  const templateComponents: WhatsappNewTemplateComponent[] = components.map((comp) =>
  {
    switch (comp) {
      case "body": {
        let rawBody = messageTemplate[comp] as TemplateBody;
        const parsedText = parseVariables(rawBody.text);

        let bodyComponent: WhatsappBodyTemplateComponent = {
          type: WhatsappTemplateComponentTypes.Body,
          text: parsedText.newText,
        };

        if (parsedText.varCount > 0) {
          if (parsedText.varCount === rawBody.examples.length) {
            bodyComponent.example.body_text = rawBody.examples;
          } else {
            tools.Logger.error(() => `Error parsing template body - Variable count mismatch`);
          }
        }
        return bodyComponent;
      }

      case "footer": {
        let footerComponent: WhatsappBodyTemplateComponent = {
          type: WhatsappTemplateComponentTypes.Footer,
          text: messageTemplate[comp],
        };
        return footerComponent;
      }

      case "header": {
        let rawHeader = messageTemplate[comp] as TemplateHeader;
        let headerComponent: WhatsappHeaderTemplateComponent = {
          format: rawHeader.type,
          type: WhatsappTemplateComponentTypes.Header,
        };
        headerComponent = addExampleToHeader(headerComponent, rawHeader.examples[0], tools);
        return headerComponent;
      }

      case "buttons": {
        let rawButtons = messageTemplate[comp] as WhatsappTemplateButtons[];
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

function addExampleToHeader(header: WhatsappHeaderTemplateComponent, headerExample: string, tools: HandlerTools) 
{
  tools.Logger.log(() => `[ManageTemplateService]._addExampleToHeader - Adding example content to header...`);

  if (header.format == TemplateHeaderTypes.TEXT) {
    const textHeader = header as WhatsappTextHeaderTemplateComponent;
    const parsedText = parseVariables(textHeader.text);


    if (parsedText.varCount == 1) {
      textHeader.example.header_text = [headerExample];
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

function parseVariables(text: string): { varCount: number, newText: string; }
{
  const varExp: RegExp = new RegExp('\{{(.*?)\}}');
  let newText: string = text;
  if (!varExp.test(text)) return { varCount: 0, newText };

  const varCount = countInstances(text, varExp);

  const textArray = text.split(" ");

  // Replace the variables with incremental numbers e.g.
  //   {{name}} to {{1}}, to be read by whatsapp
  for (let i = 0; i < textArray.length; i++) {
    if (varExp.test(textArray[i])) {
      newText = newText.replace(varExp, `{{${i + 1}}}`);
    }
  }

  return { varCount, newText };
}

function countInstances(text: string, varExp: RegExp)
{
  return (text.match(varExp) || []).length;
}