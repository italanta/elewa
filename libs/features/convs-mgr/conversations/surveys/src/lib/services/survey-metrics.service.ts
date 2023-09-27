import { Injectable } from '@angular/core';
import { SurveyCursor } from '@app/model/convs-mgr/conversations/admin/system';
import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { EndUserDetails } from '@app/state/convs-mgr/end-users';


@Injectable({
  providedIn: 'root'
})
export class SurveyMetricsService {

  constructor() { }

  passedCount = 0;
  failedCount = 0;
  averageCount = 0;
  inProgressCount = 0;
  belowAverageCount = 0;
  scores:number[] = [];

  /** Returns a list of users that have attempted the survey */
  // computeMetrics(endUsers: EndUserDetails[], survey: Survey) {
  //   this._resetMetrics();
    
  //   const data = endUsers.filter((user) => {
  //     if (!user.cursor[0].surveyStack) return false;

  //     const assessExists = user.cursor[0].surveyStack.find((assess) => assess.surveyId === survey.id);

  //     // if (assessExists) {
  //     //   user.scoreCategory = this._getScoreCategory(assessExists);
  //     //   user.selectedSurveyCursor = assessExists;
  //     //   this.scores.push(assessExists.score);
  //     //   return true;
  //     // }

  //     // else return false;
  //   });

  //   return {
  //     data,
  //     scores: this.scores,
  //     surveyMetrics: {
  //       inProgress: this.inProgressCount,
  //       completedRes: (this.averageCount + this.belowAverageCount + this.failedCount + this.passedCount) 
  //     },
  //     chartData: [this.passedCount, this.averageCount, this.inProgressCount, this.belowAverageCount, this.failedCount]
  //   };
  // }

  /** Get the score category of a user and compute the necessary values */
  // private _getScoreCategory(surveyCursor: SurveyCursor) {
  //   if (!surveyCursor.finishedOn) {
  //     this.inProgressCount++
  //     return 'In progress'
  //   }

  // }

  /** Reset values back to zero - we do this on every calculation */
  private _resetMetrics() {
    this.passedCount = 0;
    this.failedCount = 0;
    this.averageCount = 0;
    this.inProgressCount = 0;
    this.belowAverageCount = 0;
    this.scores = []
  }
}
