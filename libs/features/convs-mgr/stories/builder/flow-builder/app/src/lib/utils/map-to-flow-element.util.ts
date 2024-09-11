import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31, FlowPageTextSizesV31 } from "@app/model/convs-mgr/stories/flows";
import { FLOW_CONTROLS, FlowControlType } from "../providers/flow-controls.const";

export function _MapToFlowControl(element: FlowPageLayoutElementV31)
{
  const controls = FLOW_CONTROLS()

   // Find the matching control based on the element type
   const control = controls.find((control) => {
    switch (element.type) {
      case  FlowPageLayoutElementTypesV31.TEXT:
        return control.type === FlowControlType.Header;
     
      default:
        return false;
    }
  });

  // Return the matched control, or return a default/fallback control if no match is found
  return control || null;
}
