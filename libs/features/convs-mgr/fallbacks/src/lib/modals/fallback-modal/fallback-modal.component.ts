import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ActionTypesArray, Fallback } from '@app/model/convs-mgr/fallbacks';
@Component({
  selector: 'app-fallback-modal',
  templateUrl: './fallback-modal.component.html',
  styleUrls: ['./fallback-modal.component.scss'],
})
export class FallbackModalComponent implements OnInit {

  actionTypes = ActionTypesArray;
  fallbackForm: FormGroup;
  fallback: Fallback;
  
  constructor(public dialogRef: MatDialogRef<FallbackModalComponent>, 
              private fb: FormBuilder, 
              @Inject(MAT_DIALOG_DATA) public data: { fallback: Fallback}
            ) {
              if(this.data) {
                this.fallback = this.data.fallback
              };
            }

  ngOnInit(): void {
    this.buildForm();
    this.populateForm(this.fallback);
  }

  buildForm(): void {
    this.fallbackForm = this.fb.group({
      userInput: this.fb.array([]),
      actionsType: ['', Validators.required],
      actionDetails: this.fb.group({
        description: ['']
      }),
      active: [false],
    });
  }

  populateForm(fallback: Fallback) {
    if(!fallback) return;

    this.fallbackForm.patchValue({
      actionsType: fallback.actionsType,
      actionDetails: {
        description: fallback.actionDetails?.description || ''
      },
      active: fallback.active
    });

    if(fallback.userInput && fallback.userInput.length > 0) {
      fallback.userInput.forEach((input)=> this.addUserInput(input));
    }
  }

  get userInput(): FormArray{
    return this.fallbackForm.get('userInput') as FormArray;
  }

  createUserInputControl(): FormGroup {
    return this.fb.group({
      userInput: ['', Validators.required]
    });
  }

  addUserInput(input: string): void {
    this.userInput.push(this.fb.control(input));
  }

  removeUserInput(index: number): void {
    this.userInput.removeAt(index);
  }
}
