export enum FormViewMode {
  /**A question per page view */
  SingleQuestionView = 1,
  /** All questions per page */
  MultipleQuestionView = 2,
}

export enum PageViewMode {
  /** Show the landing page */
  HomePageView = 1,
  /** Show assessment content */
  AssessmentMode = 2,
  /**Page to display after a learner has failed an assessment */
  FailFeedbackMode = 3,
  /** Page to show after a user is done with an assessment */
  RedirectPage = 4
}
