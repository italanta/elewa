import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { distinctUntilChanged } from "rxjs";

@Injectable({
  providedIn: 'root'
})

/** This util service helps in setting actions on the fallback form depending on selected actions */
export class FormControlUtilService {

  constructor() {}

  handleModuleChange(form: FormGroup): void {
    form?.get('actionDetails.moduleId')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(moduleId => {
      if (moduleId) {
        this.enableFormControlsBasedOnAction(form);
      } else {
        this.resetFormControls(form);
      }
    });
  }

  handleActionChange(form: FormGroup): void {
    form?.get('actionsType')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(action => {
      this.resetFormControls(form);
      switch (action) {
        case 'Route':
          this.enableFormControls(form, ['actionDetails.moduleId', 'actionDetails.storyId', 'actionDetails.block']);
          break;
        case 'Restart':
          this.enableFormControls(form, ['actionDetails.moduleId']);
          break;
        case 'Next Block':
          this.enableFormControls(form, ['actionDetails.moduleId']);
          break;
        case 'ResendLastMessage':
          this.enableFormControls(form, ['actionDetails.moduleId']);
          break;
      }
    });
  }

  private enableFormControls(form: FormGroup, controls: string[]): void {
    controls.forEach(control => {
      form?.get(control)?.enable();
    });
  }

  /** reset controls every time there is a change to enable for new selection */
  private resetFormControls(form: FormGroup): void {
    form?.get('actionDetails.storyId')?.reset();
    form?.get('actionDetails.block')?.reset();
    form?.get('actionDetails.storyId')?.disable();
    form?.get('actionDetails.block')?.disable();
  }

  /** Whick control is enabled depending on the selected action */
  private enableFormControlsBasedOnAction(form: FormGroup): void {
    const action = form?.get('actionsType')?.value;
    switch (action) {
      case 'Route':
        this.enableFormControls(form, ['actionDetails.moduleId', 'actionDetails.storyId', 'actionDetails.block']);
        break;
      case 'Restart':
        this.enableFormControls(form, ['actionDetails.moduleId']);
        break;
      case 'Next Block':
        this.enableFormControls(form, ['actionDetails.moduleId']);
        break;
      case 'ResendLastMessage':
        this.enableFormControls(form, ['actionDetails.moduleId']);
        break;
    }
  }
}
