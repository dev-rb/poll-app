import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPoll } from '../../types';
import socket from '../../utils/socket';

const BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:3001" : "https://poll-app-votes.herokuapp.com/";

socket.on("connect_error", (error) => {
    console.log("Failed to connect", error)
});

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getPollById: builder.query<IPoll, string>({
            query: (id) => `/polls/${id}`,

            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                socket.emit("JOIN_A_ROOM", arg);
                try {
                    await cacheDataLoaded;

                    const handleIncomingListener = (newUpdates: any) => {
                        if (newUpdates.id !== arg) {
                            return;
                        }

                        updateCachedData((draft) => {
                            Object.assign(draft, newUpdates);
                        });
                    }

                    socket.on("updatePoll", handleIncomingListener);
                } catch {

                }
                await cacheEntryRemoved;

                socket.close();
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        ...result.choices.map(({ id }) => ({ type: 'POLLCHOICE' as const, id })),
                        { type: 'POLLCHOICE', id: 'LIST' },
                    ]
                    : [{ type: 'POLLCHOICE', id: 'LIST' }],
        }),
        createPoll: builder.mutation<IPoll, { pollTitle: string, pollEndTimeAmount: number, pollEndTimeUnit: string, pollChoices: string[] }>({
            query: ({ pollTitle, pollEndTimeAmount, pollEndTimeUnit, pollChoices }) => ({
                url: '/polls/new',
                body: { pollTitle, pollChoices, pollTimeLimit: { amount: pollEndTimeAmount, unit: pollEndTimeUnit } },
                method: 'POST'
            }),
        })
    }),
    tagTypes: ['POLL', 'POLLCHOICE', 'LIST']
});

export const {
    useCreatePollMutation,
    useGetPollByIdQuery
} = api;