import { QuestionResponse } from "@app/model/convs-mgr/micro-app/assessments";

export function getQuestionScore(questionResponses: QuestionResponse[]) {

  for (let i = 0; i < questionResponses.length; i++) {
    if (questionResponses[i].answerId && questionResponses[i].answerId === questionResponses[i].correctAnswer) {
      questionResponses[i].score = questionResponses[i].marks;
      questionResponses[i].correct = true;
    } else if (questionResponses[i].answerText === questionResponses[i].correctAnswer) {
      questionResponses[i].score = questionResponses[i].marks;
      questionResponses[i].correct = true;
    } else {
      questionResponses[i].score = 0;
      questionResponses[i].correct = false;
    }
  }

  return { questionResponses };
}