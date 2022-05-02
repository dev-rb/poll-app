import * as React from 'react';
import styles from './pollDisplay.module.css';
import { useParams } from 'react-router-dom';
import { useGetPollByIdQuery } from '../../redux/api';
import { ActionIcon, Button, Checkbox, Group, Loader, MediaQuery, Progress, RingProgress } from '@mantine/core';
import { IPollChoice } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import socket from '../../utils/socket';
import { getVotedChoice, hasVoted, setPollVoted } from '../../utils/localStorage';
import { MdCheck, MdCopyAll } from 'react-icons/md';
import { useClipboard, useInterval } from '@mantine/hooks';
import PollHeader from './components/PollHeader';
import PollChoiceCard from './components/PollChoiceCard';
import ShareLink from './components/ShareLink';
import AlternateChoiceCard from './components/AlternateChoiceCard';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const PollDisplay = () => {

    const { id } = useParams();

    const { data, isLoading } = useGetPollByIdQuery(id!);

    const [pollEnded, setPollEnded] = React.useState(false);
    const [alreadyVoted, setAlreadyVoted] = React.useState(hasVoted(id!));
    const [activeChoice, setActiveChoice] = React.useState<string | null>(getVotedChoice(id!));
    const [activeChoiceDetails, setActiveChoiceDetails] = React.useState<IPollChoice | null>(null);

    const selectChoice = (id: string) => {
        if (alreadyVoted || pollEnded) {
            return;
        }
        setActiveChoice(id);
        const choiceWithId = data?.choices.find((val) => val.id === id);
        if (choiceWithId) {
            setActiveChoiceDetails(choiceWithId);
        }
    }

    const submitVote = () => {
        if (!activeChoice) {
            return;
        }
        socket.emit("INCREASE", { roomId: id, pollId: id, choiceId: activeChoice });

        setTimeout(() => {
            setPollVoted(id!, activeChoice);
        }, 500);
        setAlreadyVoted(true);
        setActiveChoiceDetails(null);
    }

    const checkPollEnd = () => {
        if (dayjs(data?.endTime).isBefore(dayjs())) {
            setPollEnded(true);
        }
    }

    const interval = useInterval(() => checkPollEnd(), 5000);

    React.useEffect(() => {
        checkPollEnd();
        if (data) {
            interval.start();
        }
        return () => {
            interval.stop();
        };
    }, [data])

    React.useEffect(() => {
        const choiceWithId = data?.choices.find((val) => val.id === activeChoice);
        if (choiceWithId) {
            setActiveChoiceDetails(choiceWithId);
        }
    }, [activeChoice, data])

    return (
        <div className={styles.displayContainer}>
            {data ?
                <div className={styles.displayChoices}>
                    <div className={styles.titleAndChoices}>
                        <PollHeader name={data.name} createdAt={data.createdAt} hasPollEnded={pollEnded} />
                        <div className={styles.pollChoices}>
                            {data.choices.map((val) =>
                                <AlternateChoiceCard
                                    key={val.id}
                                    {...val}
                                    totalVotes={data.totalVotes}
                                    isSelected={val.id === activeChoice}
                                    selectChoice={selectChoice}
                                />
                            )}
                        </div>
                    </div>
                    <div className={styles.userValueAndSubmit}>
                        {/* <RingProgress sections={[{ value: timeLeft, color: 'blue' }]} /> */}
                        <div className={styles.choiceLabel}>
                            <h4> You chose </h4>
                            <h1> {activeChoiceDetails?.title} </h1>
                        </div>

                        <VoteButton alreadyVoted={alreadyVoted} submitVote={submitVote} />
                        <ShareLink />
                    </div>
                </div> :
                <div className={styles.noDataDisplay}>
                    <Loader />
                </div>

            }
        </div>
    );
}

export default PollDisplay;

interface Props {
    alreadyVoted: boolean,
    submitVote: () => void
}

const VoteButton = ({ alreadyVoted, submitVote }: Props) => {
    return (
        <>
            <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                <Button className={styles.submitVoteButton} size={'lg'} disabled={alreadyVoted} onClick={submitVote}> {alreadyVoted ? "Thanks for Voting!" : "Submit Vote"} </Button>
            </MediaQuery>

            <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
                <Button className={styles.submitVoteButton} size={'sm'} disabled={alreadyVoted} onClick={submitVote}> {alreadyVoted ? "Thanks for Voting!" : "Submit Vote"} </Button>
            </MediaQuery>
        </>
    );
}