export interface IPoll {
    id: string,
    name: string,
    totalVotes: number,
    choices: IPollChoice[],
    endTime?: Date,
    createdAt: Date
}

export interface IPollChoice {
    id: string,
    title: string,
    votes: number,
    pollId: string
}