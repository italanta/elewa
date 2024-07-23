import { MicroApp } from "@app/model/convs-mgr/micro-app/base";
import { Story } from "@app/model/convs-mgr/stories/main";

export interface Assessment extends Story, MicroApp {
    title: string,
    instructions: string[],
    description: string,
    orgId: string,
    configs?: AssessmentConfiguration,
    scoreCategories?: ScoreCategory[],

    questionsOrder? : string[],
    /** Differentiate between published assessment and non published ones */
    isPublished?: boolean
    metrics?: AssessmentMetrics
}

export interface AssessmentMetrics {
    inProgress: number,
    completedRes?: number
}

export interface AssessmentConfiguration{
    feedback: FeedbackType,
    userAttempts?: number,
    /** Is a user allowed to retake an assessment */
    canRetry: boolean
    retryType?: RetryType,
    questionsDisplay: QuestionDisplayed,
    /** User attempts based on scores */
    scoreAttempts?: ScoreAttempType,
    passMark?: number;
}

export interface ScoreCategory{
    min: number,
    max: number,
    category: CategoryType
}


export enum FeedbackType{
    Immediately = 1,
    OnEnd = 2,
    Never = 3
}

export enum CategoryType{
    Fail = 1,
    Pass = 2,
    Exceptional = 3
}

/** Mode of retry allowed, if any */
export enum RetryType {
    Default = 1,
    OnScore = 2
}

/** How may questions to display per page */
export enum QuestionDisplayed {
    Single = 1,
    Multiple = 2
}

export interface ScoreAttempType {
    minScore: number, 
    userAttempts: number,
}