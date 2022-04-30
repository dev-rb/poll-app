import * as React from 'react';
import styles from './pollDisplay.module.css';
import { useParams } from 'react-router-dom';
import { useGetPollByIdQuery } from '../../redux/api';
import { ActionIcon, Button, Checkbox, Loader, Progress, RingProgress } from '@mantine/core';
import { IPollChoice } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import socket from '../../utils/socket';
import { hasVoted, setPollVoted } from '../../utils/localStorage';
import { MdCheck, MdCopyAll } from 'react-icons/md';
import { useClipboard, useInterval } from '@mantine/hooks';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const PollDisplay = () => {

    const { id } = useParams();

    const { data, isLoading } = useGetPollByIdQuery(id!);
    const clipboard = useClipboard();

    const [timeLeft, setTimeLeft] = React.useState(60);
    const [alreadyVoted, setAlreadyVoted] = React.useState(hasVoted(id!));
    const [activeChoice, setActiveChoice] = React.useState<string | null>(null);
    const [activeChoiceDetails, setActiveChoiceDetails] = React.useState<IPollChoice | null>(null);

    const updateTime = () => {
        if (data) {
            const test = parseInt(dayjs(data?.createdAt).add(60, 's').fromNow(true));
            console.log("Time passed since created + 60 sec: ", test)
            setTimeLeft((prev) => prev - (test) / 60);
        }
    }

    const interval = useInterval(updateTime, 1000);

    const selectChoice = (id: string) => {
        if (alreadyVoted) {
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
        setAlreadyVoted(true);
        setActiveChoice(null);
        setActiveChoiceDetails(null);

        setTimeout(() => {
            setPollVoted(id!);
        }, 500);
    }

    React.useEffect(() => {
        console.log("Time Left: ", timeLeft);

        if (timeLeft === 0) {
            interval.stop();
            console.log("Timer Complete!");
            console.log(dayjs());
        }

    }, [timeLeft])

    // React.useEffect(() => {
    //     const test = dayjs(dayjs().diff(dayjs(data?.createdAt).add(120 * 60, 's'), 'seconds')).toDate().toLocaleTimeString();
    //     console.log("Time passed since created + 60 sec: ", test)
    //     if (data) {
    //     }
    // }, [interval])

    return (
        <div className={styles.displayContainer}>
            {data ?
                <div className={styles.displayChoices}>
                    <div className={styles.titleAndChoices}>
                        <div className={styles.choicesHeader}>
                            <h1> {data.name} </h1>
                            <h6> Created <span>{dayjs(data.createdAt).fromNow(true)} </span> ago </h6>
                        </div>
                        <div className={styles.pollChoices}>
                            {data.choices.map((val) => <PollChoice key={val.id} {...val} totalVotes={data.totalVotes} isSelected={val.id === activeChoice} selectChoice={selectChoice} />)}
                        </div>
                    </div>
                    <div className={styles.userValueAndSubmit}>
                        {/* <RingProgress sections={[{ value: timeLeft, color: 'blue' }]} /> */}
                        <div className={styles.choiceLabel}>
                            <h4> You chose </h4>
                            <h1> {activeChoiceDetails?.title || (alreadyVoted ? "You've Already Voted" : "No Choice Selected")} </h1>
                        </div>

                        <Button className={styles.submitVoteButton} size={'lg'} disabled={alreadyVoted} onClick={submitVote}> {alreadyVoted ? "Thanks for Voting!" : "Submit Vote"} </Button>
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
                <Progress value={votes / (totalVotes > 0 ? totalVotes : 1)} styles={{ bar: { backgroundColor: '#5FDF9E' }, root: { backgroundColor: '#323237' } }} />
            </div>
        </button>
    );
}