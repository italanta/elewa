import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPublishService
{

  constructor( private _logger: Logger
    ) { }

  publish(newAssessment: Assessment)
  {
    return this.__publishAssessment(newAssessment, newAssessment.isPublished as boolean);
  }

  private __publishAssessment(assessment: Assessment, isPublished: boolean) {
    // Publish the assessment as a story
    const microAppAssessment: Assessment = {
      id: assessment.id,
      name: assessment.title,
      title: assessment.title,
      configs: assessment.configs,
      description: "",
      instructions: assessment.instructions,
      pos: {
        blockId: "",
        storyId: ""
      },
      type: MicroAppTypes.Assessment,
      channel: null as any,
      orgId: assessment.orgId,
      isPublished: true,
      isAssessment: true,
      maxScore: assessment.maxScore
    };

    this._logger.log(() => `Assessment published!`)
    return of(microAppAssessment);
  }
}


// 
// THIS CODE HAS BEEN COMMENTED OUT PENDING FULL DETERMINATION OF ASSESSMENTS FLOW
// BY COMMENTING IT OUT, THIS INTRODUCES BREAKING CHANGES
// 
// ------------------------- ASSESSMENT STORY -----------------
// const orgId = assessmentStory.orgId as string;
//     const storyId = assessmentStory.id as string;

//     // Convert questions to blocks
//     const questionBlocks$ = questions$.pipe(map(questions => {
      
//     let blocks = questions.map(question =>
//     {
//       return {
//         id: question.id,
//         type: StoryBlockTypes.AssessmentQuestionBlock,
//         message: question.message,
//         marks: question.marks,
//         options: this.__questionOptionsToBlockOptions(question.options as AssessmentQuestionOptions[])
//       } as AssessmentQuestionBlock;
//     })

//     // Create and add the end block
//     const endBlock = {
//       id: 'end-assessment',
//       type: StoryBlockTypes.EndStoryAnchorBlock,
//     } as EndStoryAnchorBlock;

//     // Add feedback after each question
//     blocks = this.__addFeedbackBlocks(blocks) as any;

//     return [...blocks, endBlock];
//   }));

//   const connections$ = questionBlocks$.pipe(map(blocks => {

//     const connections = blocks.map((block, index) =>
//     {
//       return {
//         id: `con_${block.id}`,
//         sourceId: index === 0 ? assessment.id : `defo-${blocks[index - 1].id}`,
//         targetId: block.id,
//       } as StoryBlockConnection;
//     })
    
//     // const lastConnection = {
//     //   id: `con_end`,
//     //   sourceId: `defo-${blocks[blocks.length - 1].id}`,
//     //   targetId: 'end-assessment',
//     // } as StoryBlockConnection;

//     return [...connections];
//   }));

//     // Create the story
//     const publishAssessment$ = this._story$.publish(assessmentStory);

//     // Add the blocks to the store
//     const addBlocks$ = questionBlocks$.
//                               pipe(switchMap(blocks => 
//                                     this._blocks$$.addBlocksByStory(storyId, orgId, blocks, isPublished)));

//     // Add the connections to the store
//     const addConnections$ = connections$.
//                               pipe(switchMap(connections => 
//                                     this._connections$$.addConnectionsByStory(storyId, orgId, connections, isPublished)));

//     return combineLatest([publishAssessment$, addBlocks$, addConnections$])
//             .pipe(tap(() =>this._logger.log(() => `Assessment published!`)));
//   }

//   private __questionOptionsToBlockOptions(questionOptions: AssessmentQuestionOptions[])
//   {
//     return questionOptions.map(option =>
//     {
//       return {
//         id: option.id,
//         message: option.text,
//         value: option.accuracy as any || ""
//       } as ButtonsBlockButton<Button>;
//     });
//   }

//   private __addFeedbackBlocks(blocks: AssessmentQuestionBlock[])
//   {
//     // Insert feedback blocks after each question
//     return blocks.flatMap((block) => {
//       const result: (AssessmentQuestionBlock | TextMessageBlock)[] = [block];
      
//       // Only add if the feedback exists on the question
//       if (block.feedback) {
//         result.push({ 
//           id: `feedback-${block.id}`,
//           type: StoryBlockTypes.TextMessage,
//           message: block.feedback 
//         } as TextMessageBlock);
//       }
      
//       return result;
//     });
