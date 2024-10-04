import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { AssessmentProgress, Attempt } from "@app/model/convs-mgr/micro-app/assessments";
import { getMediaType } from "../check-media-type.util";

export function QuestionsToHTML(allQuestions: AssessmentQuestion[], progress: AssessmentProgress) {
  let questionsHTML = '';
  const attemptCount = progress.attemptCount.toString();

  const currentAttempt = progress.attempts[attemptCount as any];
  
  // Check if currentAttempt and questionResponses are defined
  if (currentAttempt && currentAttempt.questionResponses) {
    allQuestions.forEach((question, index) => {
      const response = currentAttempt.questionResponses[question.id as string];
      if (response) {
        const questionScore = response.score || 0;
        const questionMarks = question.marks || 0;
        
        const points = `${questionScore}/${questionMarks}`;
        questionsHTML += Question(index, points, question, currentAttempt);
      }
    });
  }
  
  return questionsHTML;
}

export const Question = (index: number, points: string, questionDetails: AssessmentQuestion, attempt: Attempt) => 
  `<div class="question">
<div class="question-header">
  <span class="question-number">Question ${(index+1)}</span>
  <span class="question-points">${points} points</span>
</div>
<hr/>
<div class="question-body">
  ${ questionDetails.mediaPath && getMediaType(questionDetails.mediaPath) === 'image'  ? `<img class="uploaded-media" src="${questionDetails.mediaPath}" />`: ''}
  ${ questionDetails.mediaPath && getMediaType(questionDetails.mediaPath) === 'video'  ? `<a class="uploaded-media" href="${questionDetails.mediaPath}" target="_blank">Click to see video</a>`: ''}
  <span class="question-text">
    ${questionDetails.message}
  </span>
  <div class="question-options">
    ${OptionsToHTML(questionDetails, attempt)}
  </div>
</div>
<div class="q-body">
  <div class="question-text"></div>
  <div class="question-answers"></div>
</div>
<br/>
</div>
`

export function OptionsToHTML(question: AssessmentQuestion, currentAttempt: Attempt) {
  let optionsHTML = '';
  const questionResponse = currentAttempt.questionResponses[question.id as string];

  if (questionResponse && question.options) {
    for (const option of question.options) {
      const isSelected = questionResponse.answerId === option.id;
      const isCorrect = (questionResponse.answerId === questionResponse.correctAnswer || option.id === questionResponse.correctAnswer);
      const optionClass = isCorrect ? 'correct' : 'wrong';
      const optionOutcome = isCorrect ? 'Correct' : 'Incorrect';

      const checked = isSelected ? `checked="checked"` : '';
      const feedback = (isSelected || option.id === questionResponse.correctAnswer) ? option.feedback : '';
      const optionOutcomeTag = (isSelected || option.id === questionResponse.correctAnswer) ? `<span class="${optionClass}">${optionOutcome}</span>` : '';
      optionsHTML += Option(option.text, checked, feedback, optionClass, optionOutcomeTag);
    }
  }

  return optionsHTML;
}

export const Option = (optionText: string, checked: string, feedback: string, optionClass: string, optionOutcomeTag: string) => 
  `<div class="option">
      <div class="option-details">
        <input type="radio" ${checked} class="${optionClass}"/>
        <label>${optionText}</label>
      </div>
      <span class="feedback">${optionOutcomeTag}${feedback ? ":" : ''} ${feedback ? feedback : ''}</span>
    </div>`