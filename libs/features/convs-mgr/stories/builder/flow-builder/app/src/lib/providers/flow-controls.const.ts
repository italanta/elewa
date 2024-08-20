/** A single flow control */
export interface FlowControl 
{ 
  /** Group to which the control belongs */
  group: string;

  /** Label/name of the control */
  label: string;

  /** Value of the control */
  type: FlowControlType;
  
  /** Control icon */
  icon: string;

  /** Id */
  id: string;

  /** dropped */
  dropped?: boolean
}

export enum FlowControlType
{
  Header = 'h1',
  LightHeader = 'h2',
  Text = 'text',
  Caption = 'caption',
  Image = 'image',
  Link = 'link',
  Footer = 'footer',
  TextInput = 'textInput',
  TextArea = 'textArea',
  Select = 'select',
  Radio = 'radio',
  OptIn = 'checkbox',
  Datepick = 'datepick'
}

/** List of all flow controls (wrapped into a function to avoid direct editing of the list) */
export const FLOW_CONTROLS: () => FlowControl[] = () => [
  { id: '1',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Header',       type: FlowControlType.Header,       icon:'fa-solid fa-heading' },
  { id: '2',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Light Header', type: FlowControlType.LightHeader,       icon:'fa-solid fa-bold' },
  { id: '3',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Text',         type: FlowControlType.Text,     icon:'fa-solid fa-font' },
  { id: '4',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Small text',   type: FlowControlType.Caption,  icon:'fa-solid fa-subscript' },

  { id: '5',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Image',  type: FlowControlType.Image,  icon:'fa-regular fa-image' },
  { id: '6',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Link',   type: FlowControlType.Link,   icon:'fa-solid fa-link' },
  { id: '7',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Footer', type: FlowControlType.Footer, icon:'fa-solid fa-window-minimize' },

  { id: '8',  group: 'FLOW-CATEGORY.INPUT-ELS', label:'Single line text', type: FlowControlType.TextInput,  icon:'fa-solid fa-font' },
  { id: '9',  group: 'FLOW-CATEGORY.INPUT-ELS', label:'Text area',        type: FlowControlType.TextArea,   icon:'fa-solid fa-pen-fancy' },
  { id: '10', group: 'FLOW-CATEGORY.INPUT-ELS', label:'List selection',   type:  FlowControlType.Select,   icon:'fa-solid fa-list-check' },
  { id: '12', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Radio buttons',    type: FlowControlType.Radio,      icon:'fa-solid fa-circle-dot' },
  { id: '13', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Opt in',           type: FlowControlType.OptIn,      icon:'fa-solid fa-square-check' },
  { id: '14', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Date picker',      type: FlowControlType.Datepick,   icon:'fa-solid fa-calendar-days' },
]

/**
 * Util fn that group available controls into a list for displaying on the frontend
 */
export function GROUP_FLOW_CONTROL_GROUPS(controls:  FlowControl[]): { group: string, controls: FlowControl[] }[] 
{
  return [
    {
      group: 'FLOW-CATEGORY.TEXT-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.TEXT-ELS')
    },
    {
      group: 'FLOW-CATEGORY.DESIGN-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.DESIGN-ELS')
    },
    {
      group: 'FLOW-CATEGORY.INPUT-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.INPUT-ELS')
    }
  ];
}
