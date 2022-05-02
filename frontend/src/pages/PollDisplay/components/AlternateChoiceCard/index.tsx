import * as React from 'react';
import styles from './alternateCard.module.css';
import { Checkbox, Progress } from '@mantine/core';
import { IPollChoice } from '../../../../types';

interface PollChoiceProps extends IPollChoice {
    isSelected: boolean,
    selectChoice: (id: string) => void,
    totalVotes: number
}

const AlternateChoiceCard = ({ id, isSelected, selectChoice, title, votes, totalVotes }: PollChoiceProps) => {
    return (
        <button className={styles.choiceContainer} onClick={() => selectChoice(id)} data-selected={isSelected}>
            <div className={styles.checkAndTotal}>
                <Checkbox
                    styles={{ input: { backgroundColor: '#1D1D20', borderColor: '#6E6E6E', ':checked': { backgroundColor: 'white', borderColor: 'transparent' } }, icon: { color: '#3071E8' } }}
                    checked={isSelected}
                    readOnly
                />
                <div className={styles.choiceTitleAndBar}>
                    <h4> {title} </h4>
                    <Progress className={styles.progressBar} value={(votes / (totalVotes > 0 ? totalVotes : 1)) * 100} styles={{ bar: { backgroundColor: '#5FDF9E' }, root: { backgroundColor: '#323237' } }} />
                </div>
                <h6> {votes} votes </h6>
            </div>

        </button>
    );
}

export default AlternateChoiceCard;