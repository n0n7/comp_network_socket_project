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

const auth = require("./router/auth")

// Authentication router
app.use("/auth", auth)

interface Client {
    id: string
    name: string
    socket: Socket
    roomName?: string
}

interface ChatRoom {
    name: string
    clientIds: string[]
}

const clients: Client[] = []
const rooms: ChatRoom[] = []

io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`)

    socket.on("set_name", (name: string) => {
        clients.push({ id: socket.id, name, socket })
        console.log(clients)
    })

    socket.on("get_clients", () => {
        io.emit("clients", clients)
    })

    socket.on("get_rooms", () => {
        io.emit("rooms", rooms)
    })

    socket.on("message", (message: string, clientIds?: string) => {
        const sender = clients.find(
            (client) => client.socket.id === socket.id
        )?.name

        const roomIndex = rooms.findIndex((room) =>
            room.clientIds.includes(socket.id)
        )

        const room = rooms[roomIndex]

        if (clientIds) {
            clients.forEach((client) => {
                if (clientIds === client.id) {
                    client.socket.emit("message", { sender, message })
                }
            })
        } else {
            io.to(room.name).emit("message", { sender, message })
        }
    })

    socket.on("create_room", (roomName: string) => {
        if (rooms.some((room) => room.name === roomName)) {
            // TODO: error handling
            return
        }
        const newRoom: ChatRoom = { name: roomName, clientIds: [socket.id] }
        rooms.push(newRoom)

        socket.join(roomName)

        const clientIndex = clients.findIndex(
            (client) => client.id === socket.id
        )
        if (clientIndex !== -1) {
            clients[clientIndex].roomName = roomName
        }

        // TODO: emit to all clients
    })

    socket.on("join_room", (roomName: string) => {
        // Check if the room exists
        const room = rooms.find((room) => room.name === roomName)
        if (!room) {
            socket.emit("room_error", "Room does not exist")
        } else {
            // Join the room
            socket.join(roomName)
            // Update the client's room property
            const clientIndex = clients.findIndex(
                (client) => client.socket.id === socket.id
            )
            if (clientIndex !== -1) {
                clients[clientIndex].roomName = roomName
            }
            // Send a confirmation message to all client in room
            io.to(roomName).emit("room_message", {
                message: `${clients[clientIndex].name} has joined the room`,
            })
        }
    })

    socket.on("leave_room", () => {
        const clientIndex = clients.findIndex(
            (client) => client.socket.id === socket.id
        )
        if (clientIndex !== -1 && clients[clientIndex].roomName) {
            const roomName = clients[clientIndex].roomName
            socket.leave(roomName!) // Leave the room
            // Clear the client's room property
            clients[clientIndex].roomName = undefined
            // Send a confirmation message to the client
            io.to(roomName!).emit("room_message", {
                message: `${clients[clientIndex].name} has joined the room`,
            })
        }
    })

    socket.on("kick", (clientId: string) => {
        const clientIndex = clients.findIndex(
            (client) => client.socket.id === socket.id
        )
        const kickedClientIndex = clients.findIndex(
            (client) => client.socket.id === clientId
        )
        if (clientIndex !== -1 && kickedClientIndex !== -1) {
            const roomName = clients[clientIndex].roomName
            const kickedClientRoomName = clients[kickedClientIndex].roomName
            if (roomName && roomName === kickedClientRoomName) {
                const roomIndex = rooms.findIndex(
                    (room) => room.name === roomName
                )
                if (roomIndex !== -1) {
                    const clientIndexInRoom =
                        rooms[roomIndex].clientIds.indexOf(clientId)
                    if (clientIndexInRoom !== -1) {
                        rooms[roomIndex].clientIds.splice(clientIndexInRoom, 1)
                        clients[kickedClientIndex].roomName == undefined
                        io.to(clientId).emit("kicked", {
                            message: "You have been kicked from the room",
                        })
                        clients[kickedClientIndex].socket.leave(roomName)
                    }
                }
            }
        }
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        const clientIndex = clients.findIndex(
            (client) => client.socket.id === socket.id
        )
        if (clientIndex !== -1) {
            const disconnectedClient = clients.splice(clientIndex, 1)[0]
            const roomName = disconnectedClient.roomName
            if (roomName) {
                socket.leave(roomName)
                const roomIndex = rooms.findIndex(
                    (room) => room.name === roomName
                )
                if (roomIndex !== -1) {
                    const clientIndexInRoom = rooms[
                        roomIndex
                    ].clientIds.indexOf(socket.id)
                    if (clientIndexInRoom !== -1) {
                        rooms[roomIndex].clientIds.splice(clientIndexInRoom, 1)
                    }
                }
            }
            io.emit("clients", clients)
        }
    })
})

server.listen(3001, () => {
    console.log("Server is running on port 3001")
})
