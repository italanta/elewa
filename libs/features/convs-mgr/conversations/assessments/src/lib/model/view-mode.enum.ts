/** 
 * Whether to display all questions in one page or a single question per view 
 */
export enum FormViewMode {
  /**A question per page view */
  SingleQuestionView = 1,
  /** All questions per page */
  MultipleQuestionView = 2,
}

/**
 *  Enum to switch between different views depending on where a learner is on an assessment
 *  Toggle between Landing page, assessment content, feedback page and redirect page
 */
export enum AssessmentPageViewMode {
  /** Show the landing page */
  // HomePageView = 1,
  /** Show assessment content */
  AssessmentMode = 1,
  /**Page to display after a learner has failed an assessment is allowed to retry */
  ResultsMode = 2,

  /** Page to show after a user is done with an assessment */
  // RedirectPage = 4
}
