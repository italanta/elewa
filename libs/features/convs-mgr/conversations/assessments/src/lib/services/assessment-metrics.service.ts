import { Injectable } from '@angular/core';

import { EndUserDetails } from '@app/state/convs-mgr/end-users';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';

@Injectable({
  providedIn: 'root'
})
export class AssessmentMetricsService {

  passedCount = 0;
  failedCount = 0;
  averageCount = 0;
  inProgressCount = 0;
  belowAverageCount = 0;
  scores:number[] = [];

  /** Returns a list of users that have attempted the assessment */
  computeMetrics(endUsers: EndUserDetails[], assessment: Assessment) {
    this._resetMetrics();
    
    const data = endUsers.filter((user) => {
      if (!user.cursor || !user?.cursor.length || !user?.cursor[0].assessmentStack) return false;

      const assessExists = user.cursor[0].assessmentStack.find((assess) => assess.assessmentId === assessment.id);

      if (assessExists) {
        user.scoreCategory = this._getScoreCategory(assessExists);
        user.selectedAssessmentCursor = assessExists;
        this.scores.push(assessExists.score);
        return true;
      }

      else return false;
    });

    return {
      data,
      scores: this.scores,
      assessmentMetrics: {
        inProgress: this.inProgressCount,
        completedRes: (this.averageCount + this.belowAverageCount + this.failedCount + this.passedCount) 
      },
      chartData: [this.passedCount, this.averageCount, this.inProgressCount, this.belowAverageCount, this.failedCount]
    };
  }

  /** Get the score category of a user and compute the necessary values */
  private _getScoreCategory(assessmentCursor: AssessmentCursor) {
    if (!assessmentCursor.finishedOn) {
      this.inProgressCount++
      return 'In progress'
    }

    const finalScore = assessmentCursor.score;
    const finalPercentage = (assessmentCursor.maxScore == 0 ? 0 : (finalScore/assessmentCursor.maxScore)) * 100;

    if (finalPercentage >= 0 && finalPercentage < 34) {
      this.failedCount++
      return 'Failed';
    } else if (finalPercentage >= 50 && finalPercentage <= 75) {
      this.averageCount++
      return 'Average';
    } else if (finalPercentage >= 35 && finalPercentage <= 49) {
      this.belowAverageCount++
      return 'Below Average'
    } else {
      this.passedCount++
      return 'Pass';
    }
  }

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
