import { WhatsappTemplateCategoryTypes } from "./whatsapp-template-categories.enum";
import { WhatsappNewTemplateComponent } from "./whatsapp-template-components.interface";

export interface WhatsappCreateTemplate
{
  allow_category_change?: boolean;
  name: string,
  language: string,
  category: WhatsappTemplateCategoryTypes,
  components: WhatsappNewTemplateComponent[];
}