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

const clients: { [clientId: string]: Client } = {}
const rooms: { [roomName: string]: ChatRoom } = ({} = {})

function getClients() {
    // return client object but remove the socket in every client
    const clientData: { [clientId: string]: Omit<Client, "socket"> } = {}
    for (const clientId in clients) {
        const { id, name, roomName } = clients[clientId]
        clientData[clientId] = { id, name, roomName }
    }
    return clientData
}

io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`)

    socket.on("set_name", (name: string) => {
        clients[socket.id] = { id: socket.id, name, socket }
        io.emit("clients", getClients())
        socket.emit("rooms", rooms)
    })

    socket.on("message", (message: string, clientIds?: string) => {
        const sender = clients[socket.id]

        const room = rooms[sender.roomName!]

        if (clientIds) {
            clients[clientIds].socket.emit("message", { sender, message })
        } else {
            io.to(room.name).emit("message", { sender, message })
        }
    })

    socket.on("create_room", (roomName: string) => {
        console.log("Creating room", roomName)
        if (rooms[roomName]) {
            // TODO: error handling
            return
        }
        rooms[roomName] = { name: roomName, clientIds: [socket.id] }

        socket.join(roomName)

        clients[socket.id].roomName = roomName

        // TODO: emit to all clients
        io.emit("rooms", rooms)
        io.emit("clients", getClients())
    })

    socket.on("join_room", (roomName: string) => {
        // Check if the room exists
        const room = rooms[roomName]
        if (!room) {
            socket.emit("room_error", "Room does not exist")
        } else {
            // Join the room
            socket.join(roomName)
            // Update the client's room property
            clients[socket.id].roomName = roomName
            // update room's clientIds
            room.clientIds.push(socket.id)
            // Send a confirmation message to all client in room
            io.to(roomName).emit("room_message", {
                message: `${clients[socket.id].name} has joined the room`,
            })

            io.emit("rooms", rooms)
            io.emit("clients", getClients())
        }
    })

    socket.on("leave_room", () => {
        const client = clients[socket.id]
        if (client.roomName) {
            const roomName = client.roomName
            socket.leave(roomName!) // Leave the room
            // Clear the client's room property
            client.roomName = undefined
            // Remove the client from the room's clientIds
            const room = rooms[roomName!]
            const clientIndexInRoom = room.clientIds.indexOf(socket.id)
            if (clientIndexInRoom !== -1) {
                room.clientIds.splice(clientIndexInRoom, 1)
            }
            // Send a confirmation message to the client
            io.to(roomName!).emit("room_message", {
                message: `${clients[socket.id].name} has joined the room`,
            })

            io.emit("rooms", rooms)
            io.emit("clients", getClients())
        }
    })

    socket.on("kick", (clientId: string) => {
        const client = clients[socket.id]
        const kickedClient = clients[clientId]
        if (client && kickedClient) {
            const roomName = client.roomName
            const kickedClientRoomName = kickedClient.roomName
            if (roomName && roomName === kickedClientRoomName) {
                const room = rooms[roomName]
                const clientIndexInRoom = room.clientIds.indexOf(clientId)
                if (clientIndexInRoom !== -1) {
                    room.clientIds.splice(clientIndexInRoom, 1)
                    kickedClient.roomName == undefined
                    io.to(clientId).emit("kicked", {
                        message: "You have been kicked from the room",
                    })
                    kickedClient.socket.leave(roomName)

                    io.to(roomName).emit("room_message", {
                        message: `${kickedClient.name} has been kicked from the room`,
                    })

                    io.emit("rooms", rooms)
                    io.emit("clients", getClients())
                }
            }
        }
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        const disconnectedClient = clients[socket.id]
        delete clients[socket.id]
        const roomName = disconnectedClient.roomName
        if (roomName) {
            socket.leave(roomName)
            const room = rooms[roomName]
            const clientIndexInRoom = room.clientIds.indexOf(socket.id)
            if (clientIndexInRoom !== -1) {
                room.clientIds.splice(clientIndexInRoom, 1)
            }
        }
        io.emit("clients", getClients())
        io.emit("rooms", rooms)
    })
})

server.listen(3001, () => {
    console.log("Server is running on port 3001")
})
