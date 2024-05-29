import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentMicroAppBlock, MicroAppConfig } from '@app/model/convs-mgr/stories/blocks/messaging';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { SubSink } from 'subsink';
import { _JsPlumbComponentDecorator } from '../../providers/decorate-jsplumb.provider';

import { ActivatedRoute, Router } from '@angular/router';
import { MicroAppManagementService } from '@app/libs/state/convs-mgr/micro-app';


@Component({
  selector: 'app-assessment-micro-app-block',
  templateUrl: './assessment-micro-app-block.component.html',
  styleUrls: ['./assessment-micro-app-block.component.scss']
})
export class AssessmentMicroAppBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: AssessmentMicroAppBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() assessmentMicroAppForm: FormGroup;

  private _sBs = new SubSink();

  type: StoryBlockTypes;
  assessmentMicroAppType = StoryBlockTypes.MicroAppBlock;
  blockFormGroup: FormGroup;

  assessments: Assessment[];

  constructor(private _assessmentService$: AssessmentService,
              private _route: ActivatedRoute, 
              private _router: Router,
              private _microAppService: MicroAppManagementService


  ) { }

  ngOnInit() {
    this.getAssessments();
    this.getRouteParams();
  }

  ngAfterViewInit(): void
  {
    this._decorateInput();
  }

  /** Get all assessments */
  getAssessments()
  {
    this._sBs.sink = this._assessmentService$.getAssessments$().subscribe((assessments) =>
    {
      // Filter out assessments that have not been published
      this.assessments = assessments.filter((assessment) => assessment.isPublished);
    }
    );
  }

  /** Add JsPlumb connector to max score input */
  private _decorateInput()
  {
    const inputs = document.getElementsByClassName('option');
    if (this.jsPlumb) {
      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input = _JsPlumbComponentDecorator(input, this.jsPlumb);
      }
    }
  }
  /** Building query params with angular router */
  private getRouteParams(){
    this._route.queryParams.subscribe(params => {
      const microAppId = params['microAppId'];
      const endUserId = params['endUserId'];
      const config = params['configs']

      if (microAppId && endUserId && config) {
        this.initMicroApp(microAppId, endUserId, config);
      }
    });
  }

  /** Getting the link to display in the link section of an assessment */
  private initMicroApp(microAppId: string, endUserId: string, config: MicroAppConfig): void {
    this._microAppService.initMicroApp(microAppId, endUserId, config).subscribe(
      response => {
        console.log('Micro-app initialized:', response);
        const navigateUrl = response.navigateUrl;
        // Navigate the user to the micro-app URL
        window.location.href = navigateUrl;
      },
      error => {
        console.error('Error initializing micro-app:', error);
      }
    );
  }

}
