/** A single flow control */
export interface FlowControl 
{
  label: string;
  value: string;
  icon: string;
}

/**
 * List of all available controls in the flow builder
 */
export const FLOW_CONTROL_GROUPS: { group: string, controls: FlowControl[] }[] =
[
  {
    group: 'FLOW-CATEGORY.TEXT-ELS',
    controls: [
      { label:'Header',       value:'h1',       icon:'fa-solid fa-heading' },
      { label:'Light Header', value:'h2',       icon:'fa-solid fa-bold' },
      { label:'Text',         value:'text',     icon:'fa-solid fa-font' },
      { label:'Small text',   value:'caption',  icon:'fa-solid fa-subscript' },
    ]
  },
  {
    group: 'FLOW-CATEGORY.DESIGN-ELS',
    controls: [
      { label:'Image',  value:'image',  icon:'fa-regular fa-image' },
      { label:'Link',   value:'link',   icon:'fa-solid fa-link' },
      { label:'Footer', value:'footer', icon:'fa-solid fa-window-minimize' }
    ]
  },
  {
    group: 'FLOW-CATEGORY.INPUT-ELS',
    controls: [
      { label:'Single line text', value:'textInput',  icon:'fa-solid fa-font' },
      { label:'Text area',        value:'textArea',   icon:'fa-solid fa-pen-fancy' },
      { label:'List selection',   value:'select',     icon:'fa-solid fa-window-minimize' },
      { label:'Checkboxes',       value:'checkbox',   icon:'fa-solid fa-list-check' },
      { label:'Radio buttons',    value:'radio',      icon:'fa-solid fa-circle-dot' },
      { label:'Date picker',      value:'datepick',   icon:'fa-solid fa-calendar-days' },
      { label:'Opt in',           value:'optIn',      icon:'fa-solid fa-square-check' },
    ]
  }
];
