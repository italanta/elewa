import { TemplateCategoryTypes } from "../../base/message-template.interface";
import { WhatsappNewTemplateComponent } from "./whatsapp-template-components.interface";

export interface WhatsappCreateTemplate
{
  allow_category_change?: boolean;
  name: string,
  language: string,
  category: TemplateCategoryTypes,
  components: WhatsappNewTemplateComponent[];

}