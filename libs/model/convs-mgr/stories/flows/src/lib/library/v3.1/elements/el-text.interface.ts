import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

export interface FlowPageTextV31 extends FlowPageLayoutElementV31
{
  /** The text to show */
  text: string;

  size: FlowPageTextSizesV31;

  type: FlowPageLayoutElementTypesV31.TEXT;
}

export enum FlowPageTextSizesV31 
{
  /** Text header */
  Header    = 'TextHeading',
  /** Text sub header  */
  SubHeader = 'TextSubheading',
  /** Normal text - body */
  Body      = 'TextBody',
  /** Small text- Caption */
  Caption   = 'TextCaption'
}
