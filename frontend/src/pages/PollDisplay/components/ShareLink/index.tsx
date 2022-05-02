import * as React from 'react';
import styles from './shareLink.module.css';
import { ActionIcon, createStyles } from '@mantine/core';
import { MdCheck, MdCopyAll } from 'react-icons/md';
import { useClipboard } from '@mantine/hooks';

const useStyles = createStyles({
    hover: {
        ':hover': {
            backgroundColor: '#5B5B63',
            color: 'white'
        }
    },
    root: {
        height: 40,
        width: 40,
        color: '#5B5B63'
    }
})

const ShareLink = () => {
    const clipboard = useClipboard();

    const { classes } = useStyles();

    return (
        <div className={styles.shareLink}>
            <h6 className={styles.shareLabel}> Share poll </h6>
            <p> {location.pathname} </p>
            <ActionIcon
                classNames={classes}
                onClick={() => clipboard.copy(location.href)}
                variant={'hover'}
                radius="md"
            >
                {clipboard.copied ? <MdCheck size={25} /> : <MdCopyAll size={25} />}
            </ActionIcon>
        </div>
    );
}

export default ShareLink;