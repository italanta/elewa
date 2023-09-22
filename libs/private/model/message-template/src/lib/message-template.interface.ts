/**
 * Represents a message template model.
 * This interface defines the structure of a message template.
 */
export interface ModelMessageTemplate {
  /**
   * The title of the message template.
   */
  title: string;
  
  /**
   * The header content of the message template.
   */
  header?: string;

  /**
   * The body content of the message template.
   */
  body: string;

  /**
   * The footer content of the message template.
   */
  footer?: string;
}

