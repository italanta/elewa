export interface MatchStrategy {
    match : (message: string, options: any[]) => number
    matchId : (id: string, options: any[]) => number
}