import { Component, ViewChild } from '@angular/core';

import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'italanta-apps-bot-create-flow-modal',
  templateUrl: './bot-create-flow-modal.component.html',
  styleUrls: ['./bot-create-flow-modal.component.scss'],
})
export class BotCreateFlowModalComponent {
  @ViewChild('stepper') stepper: MatStepper;

  moveToNextStep() {
    this.stepper.next();
  }
}
