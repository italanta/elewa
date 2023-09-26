import { Story } from "@app/model/convs-mgr/stories/main";

export interface Survey extends Story {
    title: string,
    description: string,
    orgId: string,
    configs?: SurveyConfiguration,
    scoreCategories?: ScoreCategory[],

    /** Differentiate between published assessment and non published ones */
    isPublished?: boolean
    metrics?: SurveyMetrics
}

export interface SurveyMetrics {
    inProgress: number,
    completedRes?: number
}

export interface SurveyConfiguration{
    feedback: FeedbackType,
    userAttempts?: number
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