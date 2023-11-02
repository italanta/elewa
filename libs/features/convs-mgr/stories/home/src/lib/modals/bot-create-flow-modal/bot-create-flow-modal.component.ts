import { Component, ViewChild } from '@angular/core';

import { MatStepper } from '@angular/material/stepper';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot } from '@app/model/convs-mgr/bots';

@Component({
  selector: 'italanta-apps-bot-create-flow-modal',
  templateUrl: './bot-create-flow-modal.component.html',
  styleUrls: ['./bot-create-flow-modal.component.scss'],
})
export class BotCreateFlowModalComponent {
  @ViewChild('stepper') stepper: MatStepper;
  botFromStepper: Bot;
  botModFromStepper: BotModule

  moveToNextStep(event: Bot | BotModule) {
    this.stepper.next();

    if (event.type === 'Bot') {
      this.botFromStepper = event
    } else {
      this.botModFromStepper = event
    }
  }
}
