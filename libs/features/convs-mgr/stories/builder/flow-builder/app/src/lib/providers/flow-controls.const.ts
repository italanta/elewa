/** A single flow control */
export interface FlowControl 
{ 
  /** Group to which the control belongs */
  group: string;

  /** Label/name of the control */
  label: string;

  /** Value of the control */
  value: string;
  
  /** Control icon */
  icon: string;

  /** Id */
  id: string;

  /** dropped */
  dropped: boolean
}

/** List of all flow controls (wrapped into a function to avoid direct editing of the list) */
export const FLOW_CONTROLS: () => FlowControl[] = () => [
  { id: '1', group: 'FLOW-CATEGORY.TEXT-ELS', label:'Header',       value:'h1',       icon:'fa-solid fa-heading' , dropped: false },
  { id: '2', group: 'FLOW-CATEGORY.TEXT-ELS', label:'Light Header', value:'h2',       icon:'fa-solid fa-bold' , dropped: false },
  { id: '3', group: 'FLOW-CATEGORY.TEXT-ELS', label:'Text',         value:'text',     icon:'fa-solid fa-font' , dropped: false },
  { id: '4', group: 'FLOW-CATEGORY.TEXT-ELS', label:'Small text',   value:'caption',  icon:'fa-solid fa-subscript' , dropped: false },

  { id: '5', group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Image',  value:'image',  icon:'fa-regular fa-image' , dropped: false },
  { id: '6', group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Link',   value:'link',   icon:'fa-solid fa-link' , dropped: false },
  { id: '7', group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Footer', value:'footer', icon:'fa-solid fa-window-minimize' , dropped: false },

  { id: '8', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Single line text', value:'textInput',  icon:'fa-solid fa-font' , dropped: false },
  { id: '9', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Text area',        value:'textArea',   icon:'fa-solid fa-pen-fancy' , dropped: false },
  { id: '10', group: 'FLOW-CATEGORY.INPUT-ELS', label:'List selection',   value:'select',     icon:'fa-solid fa-window-minimize' , dropped: false },
  { id: '11', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Checkboxes',       value:'checkbox',   icon:'fa-solid fa-list-check' , dropped: false },
  { id: '12', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Radio buttons',    value:'radio',      icon:'fa-solid fa-circle-dot' , dropped: false },
  { id: '13', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Opt in',           value:'optIn',      icon:'fa-solid fa-square-check' , dropped: false },
  { id: '14', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Date picker',      value:'datepick',   icon:'fa-solid fa-calendar-days' , dropped: false },
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
