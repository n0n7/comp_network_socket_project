// src/server.ts
import express, { Request, Response } from "express"
import { Server, Socket } from "socket.io"
import cors from "cors"
import http from "http"
import { signin, signup } from "./auth"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
})

app.use(cors())
app.use(express.json())

// Authentication endpoints
app.post("/signin", signin)

app.post("/signup", signup)

app.get("/me", (req: Request, res: Response) => {})

app.get("/me", (req: Request, res: Response) => {})

interface Client {
    id: string
    name: string
    socket: Socket
}

const clients: Client[] = []

io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`)

    socket.on("set_name", (name: string) => {
        // TODO: later
    })

    socket.on("message", (message: string) => {
        const sender = clients.find(
            (client) => client.socket.id === socket.id
        )?.name
        io.emit("message", { sender, message })
    })


    socket.on("disconnect", () => {
        const clientIndex = clients.findIndex(
            (client) => client.socket.id === socket.id
        )
        if (clientIndex !== -1) {
            clients.splice(clientIndex, 1)
            io.emit("clients", getClients())
        }
    })
})

function getClients() {
    return clients.map((client) => client.name)
}

server.listen(3001, () => {
    console.log("Server is running on port 3001")
})
