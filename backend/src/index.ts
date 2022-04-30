import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express"
import http from 'http';
import cors from 'cors';
import session, { Session } from "express-session";
import { Server } from 'socket.io';
import dayjs from "dayjs";

declare module "http" {
    interface IncomingMessage {
        session: Session & {
            authenticated: boolean
        }
    }
}

const prisma = new PrismaClient();

const app = express()
const server = http.createServer(app);

// const sessionMiddleware = session({
//     secret: 'test',
//     resave: false,
//     saveUninitialized: false
// })

app.use(cors({ origin: '*' }));
// app.use(sessionMiddleware);
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/polls/:id', async (req: Request, res: Response) => {
    const pollId = req.params.id;
    console.log("Trying to get poll with id: ", req.params);
    const pollWithId = await prisma.poll.findUnique({
        where: {
            id: pollId
        },
        include: {
            choices: true
        }
    });

    res.json(pollWithId);
});

app.post('/polls/new', async (req: Request, res: Response) => {

    const reqBody = req.body;
    console.log("Post create called!", req.body)

    const receivedChoices: string[] = req.body.pollChoices;
    const newChoices = receivedChoices.map((val) => ({ title: val, votes: 0 }));
    const endTime = req.body.pollTimeLimit.amount === -1 ? null : dayjs().add(req.body.pollTimeLimit.amount, req.body.pollTimeLimit.unit).toString();

    const newPoll = await prisma.poll.create({
        data: {
            name: reqBody.pollTitle,
            endTime: endTime === null ? null : new Date(endTime),
            totalVotes: 0,
            choices: {
                createMany: {
                    data: newChoices
                }
            },
        },
        include: {
            choices: true
        }
    });

    res.json(newPoll)
});

// io.use((socket, next) => sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction));


io.on("connection", (socket) => {


    // console.log("Someone connected! ", socket.id);
    socket.on("JOIN_A_ROOM", (roomId) => {
        // console.log(`${socket.id} wants to join ${roomId}`);
        socket.join(roomId);
    });

    socket.on("INCREASE", ({ roomId, pollId, choiceId }) => {
        // socket.use((_, next) => {
        //     console.log("Checking if user has already voted!")
        // })
        // console.log("Trying to update poll with id: ", pollId);
        prisma.poll.update({
            where: {
                id: pollId
            },
            data: {
                totalVotes: {
                    increment: 1
                },
                choices: {
                    update: {
                        where: {
                            id: choiceId,
                        },
                        data: {
                            votes: {
                                increment: 1
                            }
                        }
                    }
                }
            },
            include: {
                choices: true
            }
        }).then((val) => {
            io.to(pollId).emit("updatePoll", val);

        });

    })
})

const port = 3001
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
}).on("close", async () => {
    await prisma.$disconnect();
})