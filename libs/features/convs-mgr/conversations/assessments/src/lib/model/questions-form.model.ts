import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { AssessmentFormService } from "../services/assessment-form.service";
import { CREATE_EMPTY_ASSESSMENT_FORM } from "../providers/create-empty-assessment-form.provider";

export class AssessmentsFormsModel {

  assessmentsFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _assessFormService$$: AssessmentFormService,
  ) {
    this.assessmentsFormGroup = CREATE_EMPTY_ASSESSMENT_FORM(this._fb)
  }

  get questionsList(): FormArray {
    return this.assessmentsFormGroup.get('questions') as FormArray;
  }
}