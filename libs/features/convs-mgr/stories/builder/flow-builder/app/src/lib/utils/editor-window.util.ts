import { FlowControl } from "../providers/flow-controls.const";

/**
 * 
 * @param flowControl A flow element, that is dropped to the editor
 * @returns A html element depending on the type that is picked for editing
 * The value attribute of a flow control dictates the kind of input required
 */

export function CREATE_EDITOR_INPUT(flowControl: FlowControl): HTMLInputElement | HTMLTextAreaElement | HTMLDivElement{
  switch (flowControl.value) { 
    case 'h1':
    case 'h2':
    case 'text':
    case 'smallText': {
      const input = document.createElement('input');
      input.type = 'text';
      return input;
    }
    case 'caption': {
      const textArea = document.createElement('textarea');
      textArea.rows = 2; 
      return textArea;
    }
    case 'image': {
      const fileSelect = document.createElement('input');
      fileSelect.type = 'file'
      return fileSelect
    }
    case 'link': {
      const input = document.createElement('input');
      input.type = 'url'
      return input
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
      input.type = 'date'
      return input
    }
    default: {
      const defaultInput = document.createElement('input');
      defaultInput.type = 'text';
      defaultInput.placeholder = 'Unsupported type';
      return defaultInput;
    }
  }
}