import { FormArray } from "@angular/forms";

/**
 * A function that calculates how far a learner is in answering questions. 
 * @param controls form array controls
 * @returns a percentage tracker
 */
export function __CalculateProgress(formArray: FormArray): number
 {
  // Using a Set to track question ids since Set objects are collections of values. 
  // A value in the set may only occur once; 
  const answeredQuestions = new Set<number>();

  const controls = formArray.controls
  
  for (const control of controls) {
    const id = control.value.id;
    const selectedOption = control.value.selectedOption;

    if (selectedOption) {
      answeredQuestions.add(id);
    }
  }

  const totalQuestions = controls.length;
  const answeredCount = answeredQuestions.size;

  return (answeredCount / totalQuestions) * 100;
}
