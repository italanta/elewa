import { QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { AssessmentQuestionBlock, Button } from "@app/model/convs-mgr/stories/blocks/messaging";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";

export function assessUserAnswer(questionAsked: AssessmentQuestionBlock, answer: QuestionMessage) {
  const userAnswer = answer.options[0].optionText;
  
  return __getAnswerScore(userAnswer, questionAsked.options as ButtonsBlockButton<Button>[], questionAsked.marks);
}

function __getAnswerScore(answer: string, options: ButtonsBlockButton<Button>[], marks: number): number {
  const answerOption = options.find(option => option.message === answer);

  if(!answerOption) return 0;

  if(answerOption.value === "1") {
    return marks
  } else if(answerOption.value === "3") {
    return marks / 2;
  } else {
    return 0;
  }
}