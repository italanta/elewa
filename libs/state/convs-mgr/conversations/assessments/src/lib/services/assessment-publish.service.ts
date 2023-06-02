import { Injectable } from '@angular/core';

import { map, take } from 'rxjs';

import { Assessment, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/state/organisation';

import { AssessmentsStore } from '../stores/assessments.store';
import { AssessmentQuestionService } from './assessment-question.service';
import { StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentQuestionBlock, Button } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryConnectionsStore, BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { Story } from '@app/model/convs-mgr/stories/main';


@Injectable({
  providedIn: 'root'
})
export class AssessmentPublishService
{

  constructor(private _assessmentQuestionService$$: AssessmentQuestionService,
    private _story$$: ActiveStoryStore,
    private _blocks$$: StoryBlocksStore,
    private _connections$$: StoryConnectionsStore,
    private _blockConnectionsService: BlockConnectionsService,
    private _orgId$$: ActiveOrgStore) { }

  publishAssessment$(assessment: Assessment)
  {
    const questions$ = this._assessmentQuestionService$$.getQuestions$();

    // Publish the assessment as a story
    const assessmentStory = {
      id: assessment.id,
      ...assessment
    } as Story
    const publishAssessment$ = this._story$$.update(assessmentStory);

    // Convert questions to blocks
    const questionBlocks$ = questions$.pipe(map(questions => questions.map(question =>
    {
      return {
        id: question.id,
        type: StoryBlockTypes.AssessmentQuestionBlock,
        message: question.message,
        options: this.__questionOptionsToBlockOptions(question.options as AssessmentQuestionOptions[])
      } as AssessmentQuestionBlock;
    })));

    // Add the blocks to the store
    const addBlocks$ = questionBlocks$.pipe(map(blocks => this._blocks$$.addMultiple(blocks)));

    // Create connections between questions
    const connections$ = questions$.pipe(map(questions => questions.map(question =>
    {
      return {
        id: `conn_${question.id}`,
        sourceId: question.prevQuestionId ? `defo-${question.prevQuestionId}` : assessment.id,

        // TODO: Make sure there is validation for this when publishing
        targetId: question.nextQuestionId,
      } as StoryBlockConnection;
    }
    )));

    // Add the connections to the store
    const addConnections$ = connections$.pipe(map(connections => this._connections$$.addMultiple(connections)));

    // Publish the assessment
    return publishAssessment$.pipe(take(1)).subscribe(() =>
    {
      addBlocks$.pipe(take(1)).subscribe(() =>
      {
        addConnections$.pipe(take(1)).subscribe();
      });
    }
    );
  }

  private __questionOptionsToBlockOptions(questionOptions: AssessmentQuestionOptions[])
  {
    return questionOptions.map(option =>
    {
      return {
        id: option.id,
        message: option.text,
        value: option.accuracy as any
      } as ButtonsBlockButton<Button>;
    });
  }
}
