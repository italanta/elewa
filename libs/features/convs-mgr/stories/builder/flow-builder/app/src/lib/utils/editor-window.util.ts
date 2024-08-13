import { FlowPageTextSizesV31 } from "@app/model/convs-mgr/stories/flows";
import { FlowControl } from "../providers/flow-controls.const";

export function CREATE_EDITOR_INPUT(flowControl: FlowControl): HTMLInputElement | HTMLTextAreaElement | HTMLDivElement {
  switch (flowControl.value) { 
    case 'h1':
    case 'h2': {
      const input = document.createElement('input');
      input.type = 'text';
      input.dataset['size'] = flowControl.value === 'h1' ? FlowPageTextSizesV31.Header : FlowPageTextSizesV31.SubHeader;
      return input;
    }
    case 'text': {
      const input = document.createElement('input');
      input.type = 'text';
      input.dataset['size'] = FlowPageTextSizesV31.Body;
      return input;
    }
    case 'caption': {
      const textArea = document.createElement('textarea');
      textArea.rows = 2;
      textArea.dataset['size'] = FlowPageTextSizesV31.Caption;
      return textArea;
    }
    case 'image': {
      const fileSelect = document.createElement('input');
      fileSelect.type = 'file';
      return fileSelect;
    }
    case 'link': {
      const input = document.createElement('input');
      input.type = 'url';
      return input;
    }
    case 'select':
    case 'checkbox':
    case 'radio': {
      const container = document.createElement('div');

      const input = document.createElement('input');
      input.type = flowControl.value;

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.placeholder = 'Label';

      container.appendChild(input);
      container.appendChild(labelInput);

      return container;
    }
    case 'datepick': {
      const input = document.createElement('input');
      input.type = 'date';
      return input;
    }
    default: {
      const defaultInput = document.createElement('input');
      defaultInput.type = 'text';
      defaultInput.placeholder = 'Unsupported type';
      return defaultInput;
    }
  }
}

/**
 * Adding styles to generated elements using javascript
 */
export function STYLE_INPUTS(editingContainer: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement) 
{
  editingContainer.classList.add('custom-input');
  editingContainer.style.width = '98%';
  editingContainer.style.padding = '1rem 0 1rem 1rem';
  editingContainer.style.border = '1px solid #ccc';
  editingContainer.style.borderRadius = '4px';

}
