import { FormArray } from "@angular/forms";

/**
 * A function that calculates how far a learner is in answering questions. 
 * @param controls form array controls
 * @returns a percentage tracker
 */
export function calculateProgress(formArray: FormArray): number {
  // Using a Set to track question ids since Set objects are collections of values. 
  // A value in the set may only occur once; 

  // console.log(formArray.controls);

  const controls = formArray.controls
  const answeredQuestions = new Set<number>();

  controls.forEach(control => {
    const id = control.value.id;
    const selectedOption = control.value.selectedOption;

    // console.log(control)

    if (selectedOption) {
      answeredQuestions.add(id);
    }
  });

  const totalQuestions = controls.length;
  const answeredCount = answeredQuestions.size;
  debugger
  return (answeredCount / totalQuestions) * 100;
}
