import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog  } from '@angular/material/dialog';

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { 
  DeleteElementsEnum,
  DeleteBotModalComponent,
  CreateLessonModalComponent
} from '@app/elements/layout/convs-mgr/story-elements';
import { ConnectToChannelModalComponent } from '../../../modals/connect-to-channel-modal/connect-to-channel-modal.component';

@Component({
  selector: 'italanta-apps-course-module-item',
  templateUrl: './course-module-item.component.html',
  styleUrls: ['./course-module-item.component.scss'],
})
export class CourseModuleItemComponent implements OnInit{
  @Input() botModule: BotModule;
  @Input() story: Story;


  constructor(private _dialog: MatDialog, private _router$: Router, private _botsService$: BotsStateService) {}

  specificBot: Bot | undefined; /**adding undefined here since it is described that way in the store service, removing might break something, check on this */

  ngOnInit(): void {
    this._botsService$.getBotById(this.botModule.parentBot).subscribe(response =>{
      this.specificBot = response;
    })
   }

  openModule(id: string) {
    this._router$.navigate(['modules', id]);
  }

  openLesson(id: string) {
    this._router$.navigate(['stories', id]);
  }

  editLesson(story: Story) {
    this._dialog
      .open(CreateLessonModalComponent, {
        minWidth: '600px',
        data: {
          botMode: BotMutationEnum.EditMode,
          story: story,
        },
      })
      .afterClosed();
  }

  deleteLesson(story: Story) {
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.Story, element: story, parentElement:story.parentModule
      }
    }).afterClosed();
  }

  connectToChannel(botId: string) {
    this._dialog.open(ConnectToChannelModalComponent,{
      width: '30rem',
       height: '20rem',
       data: { botId: botId }
    });
   }
  deleteBot(botId:Bot){
    this._botsService$.deleteBot(botId)
  } 

  archiveBot(bot:Bot){
    bot.isArchived = true;
    this._botsService$.updateBot(bot)
  }
  publishBot(bot:Bot){
    bot.isPublishing = true;
    bot.isPublished = true;
    this._botsService$.updateBot(bot)
      .subscribe(() => {
        bot.isPublishing = false;
      });
   }
}
