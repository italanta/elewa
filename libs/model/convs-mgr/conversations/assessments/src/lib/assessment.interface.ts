import { MicroApp } from "@app/model/convs-mgr/micro-app/base";

export interface Assessment extends MicroApp {
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

/** Additional settings of an assessment, set up on the assessment settings page */
export interface AssessmentConfiguration{
    feedback: FeedbackType,
    userAttempts?: number,
    /** Is a user allowed to retake an assessment */
    canRetry: boolean
    /** Is the retry based on attempts only, or on scores as well */
    retryType?: RetryType,
    /** On an assessment page, how many questions should a learner see? */
    questionsDisplay: QuestionDisplayed,
    /** User attempts based on scores */
    scoreAttempts?: ScoreAttempType,
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

/** Congiguration for assessment retrial when baseed on score */
export interface ScoreAttempType {
    minScore: number, 
    userAttempts: number,
}