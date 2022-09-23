export interface MatchStrategy {
    match : (message: string, options: any[]) => number
}