import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { SurveyFormService } from "../services/survey-form.service";
import { CREATE_EMPTY_SURVEY_FORM } from "../provider/create-empty-survey-form.provider";



export class SurveysFormsModel {

  surveysFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _survFormService$$: SurveyFormService,
  ) {
    this.surveysFormGroup = CREATE_EMPTY_SURVEY_FORM(this._fb)
  }

  get questionsList(): FormArray {
    return this.surveysFormGroup.get('questions') as FormArray;
  }
}