import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to communicate current steps between content section and single-question component form
 * Used in the case of a single question display config for assessments
 */
@Injectable({
  providedIn: 'root'
})
export class StepService 
{
  /** Behaviour subject to track the current step clicked */
  private currentStepSubject = new BehaviorSubject<number>(0);

  currentStep$ = this.currentStepSubject.asObservable();
  private totalSteps = 0;

  constructor() {}

  /** Store the number of steps
   *  Is the total number  of controls on a form array
   */
  setTotalSteps(totalSteps: number)
  {
    this.totalSteps = totalSteps;
  }

  setStep(step: number) {
    this.currentStepSubject.next(step);
  }

  /** Get the current step a user is on 
   *  Returns a number
   */
  getCurrentStep()
  {
    return this.currentStepSubject.getValue();
  }

  /** Handle previous navigation
   *  Update the subject with the now clicked step
   */
  prevStep()
  {
    const currentStep = this.getCurrentStep();
    if (currentStep > 0) {
      this.currentStepSubject.next(currentStep - 1);
    }
  }

  /** Handle next question navigation
   *  Update the subject with the now clicked step
   */
  nextStep() 
  {
    const currentStep = this.getCurrentStep();
    if (currentStep < this.totalSteps - 1) {
      this.currentStepSubject.next(currentStep + 1);
    }
  }
}
