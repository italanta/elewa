import { TemplateHeaderTypes, TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppMessageType, WhatsappSendTemplateParameter, WhatsappSendHeaderTemplateComponent, WhatsappSendBodyTemplateComponent, WhatsappSendTextTemplateParameter } from "@app/model/convs-mgr/functions";

/**
 * Maps message parameters to WhatsApp template components.
 *
 * @param {TemplateMessage} message - The template message containing parameters.
 * @returns {Array<WhatsappSendHeaderTemplateComponent | WhatsappSendBodyTemplateComponent>} - An array of WhatsApp template components.
 */
export function MapParamsToGeneratedMessage(message: TemplateMessage): Array<WhatsappSendHeaderTemplateComponent | WhatsappSendBodyTemplateComponent> {
  const { params: messageParams, content } = message;

  const templateComponents: Array<WhatsappSendHeaderTemplateComponent | WhatsappSendBodyTemplateComponent> = [];
  const whatsappBodyParams: WhatsappSendTemplateParameter[] = [];

  messageParams.forEach((param, index) => {
    // Append Header Params
    // Since whatsapp needs params to be arranged by the order they appear on the template, 
    //  the first param(index 0) will go to the header
    if (index === 0 && content.header) {
      const { header } = content;
      const headerParams = header.examples;

      if (header.type === TemplateHeaderTypes.TEXT && headerParams && headerParams.length > 0) {
        const whatsappHeaderParam: WhatsappSendTextTemplateParameter = {
          type: WhatsAppMessageType.TEXT,
          text: param.value,
        };

        const templateHeaderComponent: WhatsappSendHeaderTemplateComponent = {
          type: "header",
          parameters: [whatsappHeaderParam],
        };

        // Add the header component and skip this iteration to avoid adding the header param to the body
        templateComponents.push(templateHeaderComponent);
        return;
      }
    }

    // Append Body Params
    if (content.body) {
      const whatsappBodyParam: WhatsappSendTextTemplateParameter = {
        type: WhatsAppMessageType.TEXT,
        text: param.value,
      };

      whatsappBodyParams.push(whatsappBodyParam);
    }
  });

  // Add body parameters to template components if present
  if (whatsappBodyParams.length > 0) {
    const bodyTemplateComponent: WhatsappSendBodyTemplateComponent = {
      type: "body",
      parameters: whatsappBodyParams,
    };

    templateComponents.push(bodyTemplateComponent);
  }

  return templateComponents;
}
