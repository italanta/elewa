import { Injectable } from '@angular/core';

import { concatAll, concatMap, map, mergeMap, of, switchMap, take, tap } from 'rxjs';

import { Assessment, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/state/organisation';

import { AssessmentsStore } from '../stores/assessments.store';
import { AssessmentQuestionService } from './assessment-question.service';
import { StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentQuestionBlock, Button } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { StoryConnectionsStore, BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { Story } from '@app/model/convs-mgr/stories/main';



@Injectable({
  providedIn: 'root'
})
export class AssessmentPublishService
{

  constructor(private _assessmentQuestionService$$: AssessmentQuestionService,
    private _addStory$: StoriesStore,
    private _blocks$$: StoryBlocksStore,
    private _connections$$: StoryConnectionsStore,
    private _blockConnectionsService: BlockConnectionsService,
    private _orgId$$: ActiveOrgStore) { }

  publish(assessment: Assessment)
  {
    const questions$ = this._assessmentQuestionService$$.getQuestions$();

    // Publish the assessment as a story
    const assessmentStory = {
      id: assessment.id,
      configs: assessment.configs,
      ...assessment
    };

    const orgId = assessmentStory.orgId as string;
    const storyId = assessmentStory.id as string;

    // Create the story
    const publishAssessment$ = this._addStory$.add(assessmentStory, storyId);

    // publishAssessment$.subscribe();

    // Convert questions to blocks
    const questionBlocks$ = questions$.pipe(map(questions => questions.map(question =>
    {
      return {
        id: question.id,
        type: StoryBlockTypes.AssessmentQuestionBlock,
        message: question.message,
        marks: question.marks,
        options: this.__questionOptionsToBlockOptions(question.options as AssessmentQuestionOptions[])
      } as AssessmentQuestionBlock;
    })));

    // Add the blocks to the store
    const addBlocks$ = questionBlocks$.pipe(concatMap(blocks => this._blocks$$.addBlocksByStory(storyId, orgId, blocks)));

    // Not working----------------
    addBlocks$.subscribe();

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

    // return publishAssessment$
  }

  private __questionOptionsToBlockOptions(questionOptions: AssessmentQuestionOptions[])
  {
    return questionOptions.map(option =>
    {
      return {
        id: option.id,
        message: option.text,
        value: option.accuracy as any || ""
      } as ButtonsBlockButton<Button>;
    });
  }
}
