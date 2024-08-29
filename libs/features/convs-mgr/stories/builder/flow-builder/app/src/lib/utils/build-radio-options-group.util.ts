// import { Injectable } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

// @Injectable({ providedIn: 'root' })
// export class InputFormService {
//   private formBuilder: FormBuilder;

//   constructor(formBuilder: FormBuilder) {
//     this.formBuilder = formBuilder;
//   }

//   buildSingleInputForm(input: { title: string; id: string }): FormGroup {
//     return this.formBuilder.group({
//       title: input.title,
//       id: input.id
//     });
//   }

//   buildInputsForm(inputs: { title: string; id: string }[]): FormGroup {
//     const formArray = this.formBuilder.array([]);
//     inputs.forEach((input) => formArray.push(this.buildSingleInputForm(input)));
  
//     // Create a FormGroup with the formArray
//     const formGroup = this.formBuilder.group({
//       inputs: formArray
//     });
  
//     // Return the formArray control
//     return formGroup.get('inputs') as FormArray;
//   }
// }