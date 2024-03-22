import { Timestamp } from '@firebase/firestore-types';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { from, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { BackendService, UserService } from '@ngfi/angular';
import { ToastService } from '@iote/bricks-angular';
import { __FormatDateFromStorage } from '@iote/time';

import { iTalUser } from '@app/model/user';
import { Story } from '@app/model/convs-mgr/stories/main';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { EndUserPosition, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { SpinnerService } from '@app/features/convs-mgr/conversations/messaging';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { MoveChatModal } from '../../modals/move-chat-modal/move-chat-modal.component';
import { StashChatModal } from '../../modals/stash-chat-modal/stash-chat-modal.component';
import { ConfirmActionModal } from '../../modals/confirm-action-modal/confirm-action-modal.component';
import { ViewDetailsModal } from '../../modals/view-details-modal/view-details-modal.component';
import { GET_USER_AVATAR, GET_RANDOM_COLOR } from '../../providers/avatar.provider';



@Component({
  selector: 'app-chat-detail-header',
  templateUrl: './chat-detail-header.component.html',
  styleUrls: ['./chat-detail-header.component.scss'],
})
export class ChatDetailHeaderComponent implements OnChanges, OnDestroy {
  @Input() chat: Chat;
  @Input() chatStatus: string;
  @Input() userClass: string;
  @Input() currentStory: Story;
  @Input() currentPosition: EndUserPosition;

  private _sbs = new SubSink();

  extractedLearnerId: string ;// This variable will be used to store the ID of a learner extracted from enrolled learners.
  learnerClass: string ;
  className: string;

  confirmDialogRef: MatDialogRef<ConfirmActionModal>;
  moveChatDialogRef: MatDialogRef<MoveChatModal>;
  agentPaused = true;
  loading = true;
  user: iTalUser;

  avatarBgColor: string;

  constructor(private _snackBar: MatSnackBar,
              private userService: UserService<iTalUser>,
              private _backendService: BackendService,
              private _router: Router,
              private _toastService: ToastService,
              private _afsF: AngularFireFunctions,
              private _dialog: MatDialog,
              private _spinner: SpinnerService,
              private _enrolledLearners: EnrolledLearnersService,
              private _router$$: Router,
              private _classRoomService$ :ClassroomService,
              private _channelService$ :CommunicationChannelService,

  ) {
    this._sbs.sink = this.userService.getUser().subscribe((user) => (this.user = user));
    this.avatarBgColor = this.randomColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat']) {
      this.agentPaused = this.chat.status === ChatStatus.Paused;
      this.loading = false;
      if (this.confirmDialogRef) {
        this.confirmDialogRef.close();
        this.confirmDialogRef = null as any;
      } else if (this.moveChatDialogRef) {
        this.moveChatDialogRef.close();
        this.moveChatDialogRef = null as any;
      }
    }
  
    this._enrolledLearners
    .getLearnerId$(PlatformType.WhatsApp, this.chat.id)
    .subscribe(
      (learners: EnrolledEndUser[]) => {
        const learner = learners[0];
        // Check if learner.id is defined before passing it a string since learner.id is nullable
        this.extractedLearnerId = learner.id ?? ''
        // Check if learner.classId exists and set learnerClass accordingly
          this.learnerClass = learner.classId ?? '' 
      },
    );
    this._classRoomService$.getSpecificClassroom(this.learnerClass).subscribe(
      (classroomDetails: any) => {
        this.className = classroomDetails;
      }
    );
  }

  formatDate = (date: Timestamp | Date) => __FormatDateFromStorage(date);

  testPayment = () =>
    this._backendService.callFunction('purchase', {
      id: this.chat.id,
      course: 'ITC',
    });

  getClass() {
    switch (this.chat.status) {
      case ChatStatus.Running:
        return 'active';
      case ChatStatus.Ended:
        return 'complete';
      case ChatStatus.Disabled:
      case ChatStatus.Stashed:
        return '';
      default:
        return 'paused';
    }
  }

  checkStatus() {
    return this.chat.status === ChatStatus.Running;
  }

  getStatus(flowCode: string) {
    switch (flowCode) {
      case ChatStatus.Paused:
        return 'Requested for Assistance';
      case ChatStatus.PausedByAgent:
        return 'Paused by Trainer';
      case ChatStatus.Ended:
        return 'Completed';
      // case ChatStatus.PendingAssessment:
      //   return "Pending Assessment";
      // case ChatStatus.OnWaitlist:
      //   return "Requested for Assistance";
      case ChatStatus.Stashed:
        return 'Stashed';
      default:
        return 'Flowing';
    }
  }

  chatIsPaused() {
    return this.chat.status === ChatStatus.PausedByAgent;
  }

  hasCompleted() {
    return this.chat.status === ChatStatus.Ended && this.chat.awaitingResponse;
  }

  isInactive() {
    return (
      this.chat.status === ChatStatus.Stashed ||
      this.chat.status === ChatStatus.Disabled
    );
  }

  viewDetails() {
    this._dialog.open(ViewDetailsModal, {
      data: { chat: this.chat, isAdmin: this.user.roles['admin' as keyof typeof this.user.roles]},
      width: '500px',
    });
  }

  openModal(type: 'resume' | 'move' | 'stash') {
    if (this.loading || (!this.chatIsPaused() && !this.hasCompleted())) {
      this._toastService.doSimpleToast(
        'Error! Action requires chat to be paused!'
      );
      return;
    }
    switch (type) {
      case 'resume':
        this.resumeChat();
        break;
      case 'move':
        this.moveChat();
        break;
      case 'stash':
        this.stashChat();
        break;
    }
  }

  pauseChat() {
    const agentId = this.user.id;
    const req = { chatId: this.chat.id, agentId: agentId };

    this.confirmDialogRef = this._dialog.open(ConfirmActionModal, {
      data: { req: req, action: 'talkToHuman' },
      width: '500px',
    });
    this._sbs.sink = this.confirmDialogRef.afterClosed().subscribe(() => (this.loading = false));
  }

  resumeChat() {
    if (this.chat.status === ChatStatus.Paused) {
      this.moveChat();
    } else {
      this.loading = true;

      const req = { chatId: this.chat.id, action: 'resume' };

      this.confirmDialogRef = this._dialog.open(ConfirmActionModal, {
        data: { req: req, action: 'assignChat' },
        width: '500px',
      });
      this._sbs.sink = this.confirmDialogRef
        .afterClosed()
        .subscribe(() => (this.loading = false));
    }
  }

  moveChat() {
    this.moveChatDialogRef = this._dialog.open(MoveChatModal, {
      data: { chat: this.chat },
      width: '500px',
    });
  }

  stashChat() {
    this._dialog.open(StashChatModal, {
      data: { chat: this.chat },
      width: '500px',
    });
  }

  checkIfChannelExist(chat: Chat){
    const channelNo = parseInt(chat.id.split('_')[1]);
    return  this._channelService$.getChannelByNumber(channelNo)
  }

  unblockUser() {
    if (this.chat.isConversationComplete !== -1) {
      this._snackBar.open('User is not blocked!', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
      });
    } 

    this._sbs.sink = this.checkIfChannelExist(this.chat).subscribe((val) => {
      if (val.length) {
        const { storyId, blockId } = this.currentPosition;
        const req = { storyId, endUserId: this.chat.id, blockId };

        this._spinner.show();
        this._sbs.sink = this._afsF
          .httpsCallable('moveChat')(req)
          .pipe(tap(() => this._spinner.hide()))
          .subscribe(() =>
            this._snackBar.open('User unblocked!', 'OK', {
              duration: 3000,
              verticalPosition: 'top',
            })
          );

      } else {
        this._snackBar.open('Communication channel does not exist!', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  // cancelReq()
  // {
  //   const req = { chatId: this.chat.id };
  //   this._backendService.callFunction('cancelHelpRequest', req);
  // }

  completeCourse() {
    const req = { chatId: this.chat.id, course: 'ITC' };

    const callBackendService = from(
      this._backendService.callFunction('endCourse', req)
    );

    this._sbs.sink = callBackendService.subscribe();
  }

  goBack() {
    this._router.navigate(['/chats']);
  }


  getUserName = (name: string) => GET_USER_AVATAR(name);
  randomColor = () => GET_RANDOM_COLOR();

  navigateToClass(){
    this._router.navigate([`/classes/${this.learnerClass}`]);
  }

  navigateToStory(){
    this._router.navigate([`/bots/${this.currentStory.id}`]);
  }

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
