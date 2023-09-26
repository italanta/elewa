import { Injectable } from '@angular/core';

import { combineLatest, map, switchMap, tap } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import { Survey, SurveyQuestionOptions } from '@app/model/convs-mgr/conversations/surveys';

import { SurveyQuestionService } from './survey-question.service';
import { StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { SurveyQuestionBlock, Button, EndStoryAnchorBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { StoryConnectionsStore } from '@app/state/convs-mgr/stories/block-connections';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

@Injectable({
  providedIn: 'root'
})
export class SurveyPublishService
{

  constructor(private _surveyQuestionService$$: SurveyQuestionService,
    private _story$: StoriesStore,
    private _blocks$$: StoryBlocksStore,
    private _connections$$: StoryConnectionsStore,
    private _logger: Logger
    ) { }

  publish(newSurvey: Survey)
  {
    return this.__publishSurvey(newSurvey, newSurvey.isPublished as boolean);
  }

  private __publishSurvey(survey: Survey, isPublished: boolean) {
    const questions$ = this._surveyQuestionService$$.getQuestions$();

    // Publish the survey as a story
    const surveyStory = {
      id: survey.id,
      name: survey.title,
      configs: survey.configs,
      description: "",
      orgId: survey.orgId,
      isPublished: true,
      isSurvey: true,
    };

    const orgId = surveyStory.orgId as string;
    const storyId = surveyStory.id as string;

    // Convert questions to blocks
    const questionBlocks$ = questions$.pipe(map(questions => {
      
    let blocks = questions.map(question =>
    {
      return {
        id: question.id,
        type: StoryBlockTypes.SurveyQuestionBlock,
        message: question.message,
        marks: question.marks,
        feedback: question.feedback,
        options: this.__questionOptionsToBlockOptions(question.options as SurveyQuestionOptions[])
      } as SurveyQuestionBlock;
    })

    // Create and add the end block
    const endBlock = {
      id: 'end-survey',
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
        sourceId: index === 0 ? survey.id : `defo-${blocks[index - 1].id}`,
        targetId: block.id,
      } as StoryBlockConnection;
    })
    
    // const lastConnection = {
    //   id: `con_end`,
    //   sourceId: `defo-${blocks[blocks.length - 1].id}`,
    //   targetId: 'end-survey',
    // } as StoryBlockConnection;

    return [...connections];
  }));

    // Create the story
    const publishSurvey$ = this._story$.publish(surveyStory);

    // Add the blocks to the store
    const addBlocks$ = questionBlocks$.
                              pipe(switchMap(blocks => 
                                    this._blocks$$.addBlocksByStory(storyId, orgId, blocks, isPublished)));

    // Add the connections to the store
    const addConnections$ = connections$.
                              pipe(switchMap(connections => 
                                    this._connections$$.addConnectionsByStory(storyId, orgId, connections, isPublished)));

    return combineLatest([publishSurvey$, addBlocks$, addConnections$])
            .pipe(tap(() =>this._logger.log(() => `Survey published!`)));
  }

  private __questionOptionsToBlockOptions(questionOptions: SurveyQuestionOptions[])
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

  private __addFeedbackBlocks(blocks: SurveyQuestionBlock[])
  {
    // Insert feedback blocks after each question
    return blocks.flatMap((block) => {
      const result: (SurveyQuestionBlock | TextMessageBlock)[] = [block];
      
      // Only add if the feedback exists on the question
      if (block.feedback) {
        result.push({ 
          id: `feedback-${block.id}`,
          type: StoryBlockTypes.TextMessage,
          message: block.feedback 
        } as TextMessageBlock);
      }
      
      return result;
    });
  }
}
