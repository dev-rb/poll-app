import * as React from 'react';
import { Group } from '@mantine/core';
import dayjs from 'dayjs';
import styles from './pollHeader.module.css';
import { IPoll } from '../../../../types';

interface HeaderProps {
    hasPollEnded: boolean
}

type Allprops = Pick<IPoll, 'name' | 'endTime' | 'createdAt'> & HeaderProps;

const PollHeader = ({ name, createdAt, endTime, hasPollEnded }: Allprops) => {
    return (
        <div className={styles.choicesHeader}>
            <div className={styles.pollTimerEnd}>
                <h6>{hasPollEnded ? "Poll Ended" : dayjs(endTime).fromNow(true) + " remaining"} </h6>
            </div>
            <h1> {name} </h1>
            <Group align={'center'} position='apart'>
                <h6> Created <span>{dayjs(createdAt).fromNow(true)} </span> ago </h6>
            </Group>
        </div>
    );
}

export default PollHeader;