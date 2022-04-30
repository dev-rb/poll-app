export interface IPoll {
    id: string,
    name: string,
    totalVotes: number,
    choices: IPollChoice[],
    timeLimit?: number,
    createdAt: Date
}

export interface IPollChoice {
    id: string,
    title: string,
    votes: number,
    pollId: string
}