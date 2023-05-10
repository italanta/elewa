import { IObject } from "@iote/bricks";

export interface Assessment extends IObject{
    title: string,
    description: string,
    configs?: AssessmentConfiguration,
    scoreCategories?: ScoreCategory[]
}

export interface AssessmentConfiguration{
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