import * as React from 'react';
import styles from './pollChoiceCard.module.css';
import { Checkbox, Progress } from '@mantine/core';
import { IPollChoice } from '../../../../types';

interface PollChoiceProps extends IPollChoice {
    isSelected: boolean,
    selectChoice: (id: string) => void,
    totalVotes: number
}

const PollChoiceCard = ({ id, isSelected, selectChoice, title, votes, totalVotes }: PollChoiceProps) => {
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

export default PollChoiceCard;