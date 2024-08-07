import { AssessmentResult } from "./assessment-result.interface";
import { AssessmentUserResults } from "./assessment-user-results.interface";

export interface AssessmentResultResponse 
{
  /** Whether we managed to retrieve the app */
  success: boolean;

  /** The app */
  results: AssessmentResult;
  
  /** In case of error, clarify message */
  error?: string;
}

export interface AssessmentUserResultResponse 
{
  /** Whether we managed to retrieve the app */
  success: boolean;

  /** The app */
  results: AssessmentUserResults[];
  
  /** In case of error, clarify message */
  error?: string;
}