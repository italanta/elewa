import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FeedbackType, Survey } from '@app/model/convs-mgr/conversations/surveys';

import { frequencyOptions } from '../../utils/constants';
import { ChannelService } from '@app/private/state/organisation/channels';
import { Observable } from 'rxjs';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-survey-config',
  templateUrl: './survey-config.component.html',
  styleUrls: ['./survey-config.component.scss'],
})
export class SurveyConfigComponent implements OnInit{
  @Input() survey: Survey;
  @Input() surveyMode: number
  @Input() surveyFormGroup: FormGroup;

  @Input() previewMode: boolean;

  immediateFeedback = FeedbackType.Immediately;
  onEndFeedback = FeedbackType.OnEnd;
  noFeedback = FeedbackType.Never;

  channels$: Observable<CommunicationChannel[]>;

  frequency = frequencyOptions;

  surveyId: string;

  channelControl: FormControl = new FormControl();

  constructor (
    private _channelService: ChannelService,
    private _router$$: Router,
    ) {}

  ngOnInit(): void {
    this.channels$ = this._channelService.getChannelByOrg();
    this.getSurveyId();

    this.channelControl.valueChanges.subscribe((selectedChannelId) => {
      // Save the selected channel ID to local storage
      localStorage.setItem('selectedChannelId', selectedChannelId);
    });
  }


  getSurveyId(){
    this.surveyId = this._router$$.url.split('/')[2];
    localStorage.setItem('surveyId', this.surveyId);
  }

  saveToLocalStorage() {
    localStorage.setItem('channelId', this.channelControl.value);
  }

}
