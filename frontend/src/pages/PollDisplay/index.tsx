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

dayjs.extend(relativeTime);
dayjs.extend(duration);

const PollDisplay = () => {

    const { id } = useParams();

    const { data, isLoading } = useGetPollByIdQuery(id!);
    const clipboard = useClipboard();

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

    React.useEffect(() => {
        checkPollEnd();
        const check = setInterval(() => {
            checkPollEnd()
        }, 5000);
        return () => {
            clearInterval(check);
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
                        <div className={styles.choicesHeader}>
                            <h1> {data.name} </h1>
                            <Group align={'center'} position='apart'>
                                <h6> Created <span>{dayjs(data.createdAt).fromNow(true)} </span> ago </h6>
                                <h6>{pollEnded ? "Poll Ended" : dayjs(data?.endTime).fromNow(true) + " remaining"} </h6>
                            </Group>
                        </div>
                        <div className={styles.pollChoices}>
                            {data.choices.map((val) => <PollChoice key={val.id} {...val} totalVotes={data.totalVotes} isSelected={val.id === activeChoice} selectChoice={selectChoice} />)}
                        </div>
                    </div>
                    <div className={styles.userValueAndSubmit}>
                        {/* <RingProgress sections={[{ value: timeLeft, color: 'blue' }]} /> */}
                        <div className={styles.choiceLabel}>
                            <h4> You chose </h4>
                            <h1> {activeChoiceDetails?.title} </h1>
                        </div>

                        <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                            <Button className={styles.submitVoteButton} size={'lg'} disabled={alreadyVoted} onClick={submitVote}> {alreadyVoted ? "Thanks for Voting!" : "Submit Vote"} </Button>
                        </MediaQuery>

                        <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
                            <Button className={styles.submitVoteButton} size={'sm'} disabled={alreadyVoted} onClick={submitVote}> {alreadyVoted ? "Thanks for Voting!" : "Submit Vote"} </Button>
                        </MediaQuery>
                        <div className={styles.shareLink}>
                            <p> {location.pathname} </p>
                            <ActionIcon
                                onClick={() => clipboard.copy(location.href)}
                                variant={'hover'}
                                radius="md"
                                styles={{ hover: { ':hover': { backgroundColor: '#5B5B63', color: 'white' } }, root: { height: 40, width: 40, color: '#5B5B63' } }}
                            >
                                {clipboard.copied ? <MdCheck size={25} /> : <MdCopyAll size={25} />}
                            </ActionIcon>
                        </div>
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

interface PollChoiceProps extends IPollChoice {
    isSelected: boolean,
    selectChoice: (id: string) => void,
    totalVotes: number
}

const PollChoice = ({ id, isSelected, selectChoice, title, votes, totalVotes }: PollChoiceProps) => {
    return (
        <button className={styles.choiceContainer} onClick={() => selectChoice(id)} data-selected={isSelected}>
            <div className={styles.checkAndTotal}>
                <Checkbox
                    styles={{ input: { backgroundColor: '#1D1D20', borderColor: '#6E6E6E', ':checked': { backgroundColor: '#3071E8' } } }}
                    checked={isSelected}
                    readOnly
                />
                <h6> {votes} votes </h6>
            </div>
            <div className={styles.choiceTitleAndBar}>
                <h4> {title} </h4>
                <Progress value={(votes / (totalVotes > 0 ? totalVotes : 1)) * 100} styles={{ bar: { backgroundColor: '#5FDF9E' }, root: { backgroundColor: '#323237' } }} />
            </div>
        </button>
    );
}