import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { AssessmentProgress, Attempt } from "@app/model/convs-mgr/micro-app/assessments";

export function QuestionsToHTML(allQuestions: AssessmentQuestion[], progress: AssessmentProgress) {
  let questionsHTML = '';
  const attemptCount = progress.attemptCount
  const currentAttempt = progress.attempts[attemptCount]
  
  allQuestions.forEach((question, index)=> {
    const questionScore = currentAttempt.questionResponses[question.id].score;
    const questionMarks = question.marks;
    const points = `${questionScore}/${questionMarks}`

    questionsHTML+= Question(index+1, points, question, currentAttempt)
  })

  return questionsHTML;
}

export const Question = (questionNumber: number, points: string, questionDetails: AssessmentQuestion, attempt: Attempt) => 
  `<div class="question">
<div class="question-header">
  <span class="question-number">Question ${questionNumber}</span>
  <span class="question-points">${points} points</span>
</div>
<hr/>
<div class="question-body">
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
  const questionResponse = currentAttempt.questionResponses[question.id];

  for(const option of question.options) {
    const isSelected = questionResponse.answerId === option.id;
    const checked = isSelected ? `checked="checked"` : '';
    const feedback = (isSelected || questionResponse.correct) ? option.feedback : '';
    optionsHTML += Option(option.text, checked, feedback)
  }

  return optionsHTML;
}

export const Option = (optionText: string, checked: string, feedback: string) => 
  `<div class="option">
      <div class="option-details">
        <input type="radio" ${checked}/>
        <label>${optionText}</label>
      </div>
      <span class="feedback">${feedback}</span>
    </div>
`