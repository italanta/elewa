import { Injectable } from '@angular/core';

import { combineLatest, map, switchMap, tap } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import { Assessment, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/state/organisation';

import { AssessmentQuestionService } from './assessment-question.service';
import { StoryBlock, StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentQuestionBlock, Button, EndStoryAnchorBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { StoryConnectionsStore, BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPublishService
{

  constructor(private _assessmentQuestionService$$: AssessmentQuestionService,
    private _addStory$: StoriesStore,
    private _blocks$$: StoryBlocksStore,
    private _connections$$: StoryConnectionsStore,
    private _logger: Logger
    ) { }

  publish(assessment: Assessment)
  {
    const questions$ = this._assessmentQuestionService$$.getQuestions$();

    // Publish the assessment as a story
    const assessmentStory = {
      id: assessment.id,
      name: assessment.title,
      configs: assessment.configs,
      description: "",
      orgId: assessment.orgId,
    };

    const orgId = assessmentStory.orgId as string;
    const storyId = assessmentStory.id as string;

    // Convert questions to blocks
    const questionBlocks$ = questions$.pipe(map(questions => {
      
    let blocks = questions.map(question =>
    {
      return {
        id: question.id,
        type: StoryBlockTypes.AssessmentQuestionBlock,
        message: question.message,
        marks: question.marks,
        options: this.__questionOptionsToBlockOptions(question.options as AssessmentQuestionOptions[])
      } as AssessmentQuestionBlock;
    })

    // Create and add the end block
    const endBlock = {
      id: 'end-assessment',
      type: StoryBlockTypes.EndStoryAnchorBlock,
    } as EndStoryAnchorBlock;

    // Add feedback after each question
    blocks = this.__addFeedbackBlocks(blocks) as any;

    return [...blocks, endBlock];
  }));

  const connections$ = questionBlocks$.pipe(map(blocks => {

    const connections = blocks.map((block, index) =>
    {
      return {
        id: `con_${block.id}`,
        sourceId: index === 0 ? assessment.id : `defo-${blocks[index - 1].id}`,
        targetId: block.id,
      } as StoryBlockConnection;
    })
    
    const lastConnection = {
      id: `con_end`,
      sourceId: `defo-${blocks[blocks.length - 1].id}`,
      targetId: 'end-assessment',
    } as StoryBlockConnection;

    return [...connections, lastConnection];
  }));

    // Create the story
    const publishAssessment$ = this._addStory$.publish(assessmentStory);

    // Add the blocks to the store
    const addBlocks$ = questionBlocks$.pipe(switchMap(blocks => this._blocks$$.addBlocksByStory(storyId, orgId, blocks)));

    // Add the connections to the store
    const addConnections$ = connections$.pipe(switchMap(connections => this._connections$$.addConnectionsByStory(storyId, orgId, connections)));

    return combineLatest([publishAssessment$, addBlocks$, addConnections$])
            .pipe(tap(() =>this._logger.log(() => `Assessment published!`)));
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

  private __addFeedbackBlocks(blocks: AssessmentQuestionBlock[])
  {
    // Insert feedback blocks after each question
    return blocks.flatMap((block) => {
      const result: (AssessmentQuestionBlock | TextMessageBlock)[] = [block];
      
      // Only add if the feedback exists on the question
      if (block.feedbackComment) {
        result.push({ 
          id: `feedback-${block.id}`,
          type: StoryBlockTypes.TextMessage,
          message: block.feedbackComment 
        } as TextMessageBlock);
      }
      
      return result;
    });
  }
}
