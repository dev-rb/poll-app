import * as React from 'react';
import { MdSend } from 'react-icons/md';
import { Button, createStyles, NumberInput, SegmentedControl, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import styles from './pollCreate.module.css';
import { useCreatePollMutation } from '../../redux/api';

const useStyles = createStyles(() => ({
    defaultVariant: { backgroundColor: '#1D1D20', borderColor: '#5B5B63', ':focus': { borderColor: '#3071E8' } },
    input: { color: 'white' },
    description: { color: '#6B6B72 !important' },
    label: { color: '#6B6B72' },
}))

const PollCreate = () => {

    const form = useForm({
        initialValues: {
            pollTitle: '',
            pollEndTimeAmount: -1,
            pollEndTimeUnit: 'seconds',
            pollChoices: ''
        },
        validate: {
            pollTitle: (value) => value.trim().length === 0 ? 'Title cannot be empty' : null,
            pollChoices: (value) => value.trim().length === 0 ? 'Choices cannot be empty' : null
        }
    });

    const [timeUnit, setTimeUnit] = React.useState('seconds');

    const { classes } = useStyles();

    const [createPollMutation] = useCreatePollMutation();

    const navigate = useNavigate();

    const createPoll = async (values: { pollTitle: string, pollEndTimeAmount: number, pollEndTimeUnit: string, pollChoices: string }) => {
        const allChoices = values.pollChoices.split(',');
        const createdPoll = await createPollMutation({ ...values, pollChoices: allChoices }).unwrap();
        console.log("Receieved created poll! ", createdPoll, createdPoll.id)
        setTimeout(() => {
            navigate(`${createdPoll.id}`);
        }, 1000)
    }

    return (
        <div className={styles.createContainer}>
            <div className={styles.formContainer}>
                <form onSubmit={form.onSubmit(createPoll)}>
                    <h1 className={styles.settingsHeading}> Poll Settings </h1>
                    <div className={styles.pollSettings}>
                        <TextInput
                            classNames={classes}
                            label="Poll title"
                            required
                            {...form.getInputProps('pollTitle')}
                        />
                        <NumberInput
                            classNames={classes}
                            hideControls
                            defaultValue={-1}
                            min={-1}
                            label="Time limit"
                            description="Set a time limit for when the poll will end."
                            {...form.getInputProps('pollEndTimeAmount')}
                        />
                        <SegmentedControl
                            styles={{ root: { backgroundColor: '#3D3D43' }, label: { color: '#888888', ':hover': { color: '#ACACAC' } }, active: { backgroundColor: '#3071E8', color: 'white !important' }, labelActive: { color: 'white !important' } }}
                            data={[
                                { label: 'Seconds', value: 'seconds' },
                                { label: 'Minutes', value: 'minutes' },
                                { label: 'Hours', value: 'hours' },
                            ]}
                            {...form.getInputProps('pollEndTimeUnit')}
                        />

                    </div>
                    <div className={styles.pollChoices}>
                        <TextInput
                            classNames={classes}
                            label="Poll choices"
                            description="Enter a comma separated list of choices"
                            required
                            {...form.getInputProps('pollChoices')}
                        />
                        {/* <Button > Add Poll Choice </Button> */}
                    </div>
                    <Button className={styles.submitButton} type='submit' size={'lg'} rightIcon={<MdSend color="white" />}> Create Poll </Button>
                </form>
            </div>
        </div>
    );
}

export default PollCreate;