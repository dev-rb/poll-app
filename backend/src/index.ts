import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express"
import http from 'http';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

const app = express()
const server = http.createServer(app);

app.use(express.json());

const io = new Server(server);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/polls/:poll', async (req: Request, res: Response) => {
    const pollId = req.params.id;
    const pollWithId = await prisma.poll.findUnique({
        where: {
            id: pollId
        }
    });

    res.json({ pollWithId });
});

app.post('/polls/create', async (req: Request, res: Response) => {

    const reqBody = req.body;
    console.log("Post create called!", req.body)

    const newPoll = await prisma.poll.create({
        data: {
            name: reqBody.name,
            timeLimit: reqBody.timeLimit,
            choices: {
                createMany: {
                    data: reqBody.choices
                }
            },
        },
        include: {
            choices: true
        }
    });

    res.json({ newPoll })
});

const port = 3001
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
}).on("close", async () => {
    await prisma.$disconnect();
})