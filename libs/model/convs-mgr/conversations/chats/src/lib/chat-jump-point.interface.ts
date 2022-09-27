export interface ChatJumpPoint {
    name: string;
    index: number;

    milestones: ChatJumpPointMilestone[];
}

export interface ChatJumpPointMilestone {
    name: string;
    blockId: string;
}