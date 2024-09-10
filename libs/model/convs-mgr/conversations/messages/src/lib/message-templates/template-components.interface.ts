import { TemplateBody } from "./template-body.interface";
import { TemplateButton } from "./template-button.interface";
import { TemplateHeader } from "./template-header.interface";

export interface TemplateComponents {
  /** The header can be a text but whatsapp and messenger support
   *   multi-media and location in the header, the header will have 
   *    it's own type that support this.
   * 
   * NOTE: Variables can be included in the text using curly braces - {{name}}.
   *        Header supports 1 variable
   */
  header?: TemplateHeader;

  /**
   * The text that will appear in the body section of the template.
   * 
   * NOTE: Variables can be included in the text using curly braces - {{name}}
   */
  body: TemplateBody;

  /**
   * The text that will appear in the footer section of the template
   */
  footer?: string;

  /** Buttons are optional interactive components that perform specific 
   *  actions when tapped 
   * 
   *  Templates can have a mixture of up to 10 button components total
   * */
  buttons?: TemplateButton[];
}
