/**
 * A single checkbox/Radio button/...
 */
export interface FlowInlineOptionV31
{
  /** ID/Value of the option */
  id: string;
  /** Title/label of the option */
  title: string;
}

/**
 * Extended version of the inline select, used for Options control
 */
export interface FlowInlineOptionExtendedV31 extends FlowInlineOptionV31
{
  /** Selectable or no */
  enabled: boolean;

  /** Description of the itme */
  description: string;

  /** Clarifying, right-hovering, info */
  metadata: string;
}