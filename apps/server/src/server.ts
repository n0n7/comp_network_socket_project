// src/server.ts
import express, { Request, Response } from "express"
import { Server, Socket } from "socket.io"
import cors from "cors"
import http from "http"
import { db } from "./firebase/firebaseconfig"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())

// Authentication endpoints
app.post("/signin", (req: Request, res: Response) => {
    // Implement signin logic here
})

interface SignUpRequestBody {
    email: string
    username: string
    password: string
}

app.post(
    "/signup",
    async (req: Request<{}, {}, SignUpRequestBody>, res: Response) => {
        try {
            // check if request has email, username, and password
            console.log("body", req.body)
            const { email, username, password } = req.body
            if (!email || !username || !password) {
                return res.status(400).json({
                    error: "Email, username, and password are required",
                })
            }

            // Check if email already exists
            const usersRef = collection(db, "users")
            const existingUser = await getDocs(
                query(usersRef, where("email", "==", email))
            )
            if (!existingUser.empty) {
                return res.status(400).json({ error: "Email already exists" })
            }

            await addDoc(usersRef, {
                username,
                email,
                password, // Note: Storing passwords in plaintext is not recommended in production
            })

            res.status(201).json({ message: "User created successfully" })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
)

app.get("/me", (req: Request, res: Response) => {})

interface Client {
    id: string
    name: string
    socket: Socket
}

const clients: Client[] = []

io.on("connection", (socket) => {
    let id: string
    let name: string

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
