export const setPollVoted = (pollId: string, choiceId: string) => {
    localStorage.setItem(pollId, choiceId);
}

export const hasVoted = (pollId: string) => {
    return localStorage.getItem(pollId) !== null;
}

export const getVotedChoice = (pollId: string) => {
    return localStorage.getItem(pollId);
}