import { FlowControlType } from "./flow-control-type.enum";
import { FlowControl } from "./flow-control.interface";


/** List of all flow controls (wrapped into a function to avoid direct editing of the list) */
export const FLOW_CONTROLS: () => FlowControl[] = () => [
  { id: '1',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Header',       controlType: FlowControlType.Header,       icon:'fa-solid fa-heading' },
  { id: '2',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Light Header', controlType: FlowControlType.LightHeader,       icon:'fa-solid fa-bold' },
  { id: '3',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Text',         controlType: FlowControlType.Text,     icon:'fa-solid fa-font' },
  { id: '4',  group: 'FLOW-CATEGORY.TEXT-ELS', label:'Small text',   controlType: FlowControlType.Caption,  icon:'fa-solid fa-subscript' },

  { id: '5',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Image',  controlType: FlowControlType.Image,  icon:'fa-regular fa-image' },
  { id: '6',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Link',   controlType: FlowControlType.Link,   icon:'fa-solid fa-link' },
  { id: '7',  group: 'FLOW-CATEGORY.DESIGN-ELS', label:'Footer', controlType: FlowControlType.Footer, icon:'fa-solid fa-window-minimize' },

  { id: '8',  group: 'FLOW-CATEGORY.INPUT-ELS', label:'Single line text', controlType: FlowControlType.TextInput,  icon:'fa-solid fa-font' },
  { id: '9',  group: 'FLOW-CATEGORY.INPUT-ELS', label:'Text area',        controlType: FlowControlType.TextArea,   icon:'fa-solid fa-pen-fancy' },
  { id: '10', group: 'FLOW-CATEGORY.INPUT-ELS', label:'List selection',   controlType:  FlowControlType.Select,   icon:'fa-solid fa-list-check' },
  { id: '12', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Radio buttons',    controlType: FlowControlType.Radio,      icon:'fa-solid fa-circle-dot' },
  { id: '13', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Opt in',           controlType: FlowControlType.OptIn,      icon:'fa-solid fa-square-check' },
  { id: '14', group: 'FLOW-CATEGORY.INPUT-ELS', label:'Date picker',      controlType: FlowControlType.Datepick,   icon:'fa-solid fa-calendar-days' },
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
