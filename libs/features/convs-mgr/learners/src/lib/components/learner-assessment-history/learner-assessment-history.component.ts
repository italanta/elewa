import { Component } from '@angular/core';
interface AssessmentResult {
  name: string;
  score: number;
  duration: number;
  date: string;
}
const ASSESSMENT_DATA: AssessmentResult[] = [
  {
    name: "Math Quiz",
    score: 85,
    duration: 30,
    date: "2023-08-09"
  },
  {
    name: "History Test",
    score: 92,
    duration: 45,
    date: "2023-07-15"
  },
  {
    name: "Science Exam",
    score: 78,
    duration: 60,
    date: "2023-06-22"
  },
  {
    name: "Literature Assignment",
    score: 65,
    duration: 60,
    date: "2023-05-10"
  },
  {
    name: "Coding Challenge",
    score: 98,
    duration: 120,
    date: "2023-04-02"
  }
]
@Component({
  selector: 'app-learner-assessment-history',
  templateUrl: './learner-assessment-history.component.html',
  styleUrls: ['./learner-assessment-history.component.scss'],
})
export class LearnerAssessmentHistoryComponent {
  displayedColumns: string[] = ['Assessment Name', 'Score', 'Duration Taken', 'Date Taken'];
  dataSource = ASSESSMENT_DATA;
}
