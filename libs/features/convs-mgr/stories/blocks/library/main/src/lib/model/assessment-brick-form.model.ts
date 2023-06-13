import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { AssessmentBrick, ScoreOptions } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
 export function _CreateAssessmentBrickForm (_fb: FormBuilder, blockData: AssessmentBrick): FormGroup {
 
  /** Default values to dispaly on assessment block */
  const defaultScores: ScoreOptions[] = 
  [
    {
      min: 0,
      max: 50,
      category: 'fail'
    }, {
      min: 50,
      max: 75,
      category: 'pass'
    }, {
      min: 75,
      max: 100,
      category: 'excellent'
    }
  ];

  return _fb.group({
    id: [blockData?.id! ?? ''],
    defaultTarget: [''],
    assessmentId: [blockData?.assessmentId! ?? ''],
    /** 
     * NB: As on 25/04/2023 the score options are the static default scores only 
     * @see {AssessmentBrickComponent} - To create functionality to correctly accept dynamic data from the form inputs
    */
    scoreOptions: _fb.array([...defaultScores.map((score)=> initScoreOptions(_fb, score))]),
    type: [blockData.type ?? StoryBlockTypes.Assessment],
    position: [blockData.position ?? { x: 200, y: 50 }]
  });
}

/** Initialize Score options properties 
 */
function initScoreOptions(_fb: FormBuilder, score: ScoreOptions): FormGroup 
{
  return _fb.group({
    min: [score.min],
    max: [score.max],
    category: [score.category]
  });
}

