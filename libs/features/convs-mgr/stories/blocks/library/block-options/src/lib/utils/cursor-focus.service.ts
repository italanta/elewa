import { QueryList } from '@angular/core';
import { OptionInputFieldComponent } from '../components/option-input-field/option-input-field.component';

/**
 * Helper function to the focus to the next input field
 * 
 * @param currentIndex      - Current input field index
 * @param optionInputFields - List of input fields
 * 
 * @returns index of the input field to navigate too
 */
export function __FocusCursorOnNextInputOfBlock(currentIndex: number, optionInputFields: QueryList<OptionInputFieldComponent>) 
{
  const inputs = optionInputFields.toArray();

  if (currentIndex !== -1) {
    const nextIndex = currentIndex + 1;

    // If there is a next input, focus on it; otherwise, focus on the first input
    if (nextIndex < inputs.length) {
      const nextInput = inputs[nextIndex];
      nextInput.setFocus();
      return nextIndex; // Return the updated current index
    } else {
      const firstInput = inputs[0];
      firstInput.setFocus();
      return 0; // Reset the current index to 0
    }
  }

  return -1; // Handle cases where currentIndex is -1
}
