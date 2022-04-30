export const setPollVoted = (pollId: string) => {
    localStorage.setItem(pollId, "true");
}

export const hasVoted = (pollId: string) => {
    return localStorage.getItem(pollId) === "true";
}