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
        origin: "*",
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
    roomNames?: string[]
}

interface Message {
    senderId: string
    message: string
    type: "public" | "private"
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
        const { id, name, roomNames } = clients[clientId]
        clientData[clientId] = { id, name, roomNames }
    }
    return clientData
}

function leaveRoom(clientId: string, roomName: string) {
    const client = clients[clientId]
    const room = rooms[roomName]
    if (client.roomNames?.includes(roomName)) {
        client.roomNames = client.roomNames?.filter((name) => name !== roomName)
        room.clientIds = room.clientIds.filter((id) => id !== clientId)
    }
}

io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`)

    socket.on("set_name", (name: string) => {
        clients[socket.id] = { id: socket.id, name, socket }
        io.emit("clients", getClients())
        socket.emit("rooms", rooms)
    })

    socket.on(
        "message",
        ({
            message,
            clientIds,
            roomName,
        }: {
            message: string
            clientIds?: string
            roomName?: string
        }) => {
            const sender = clients[socket.id]

            if (clientIds) {
                if (!clients[clientIds]) {
                    socket.emit("error", "Client does not exist")
                    return
                }
                clients[clientIds]?.socket.emit("message", {
                    senderId: socket.id,
                    message,
                    type: "private",
                })
            } else {
                io.to(roomName!).emit("message", {
                    senderId: socket.id,
                    message,
                    type: "public",
                    roomName: roomName,
                })
            }
        }
    )

    socket.on("create_room", (roomName: string) => {
        if (rooms[roomName]) {
            // TODO: error handling
            socket.emit("error", "Room already exists")
            return
        }
        rooms[roomName] = { name: roomName, clientIds: [socket.id] }

        socket.join(roomName)

        if (!clients[socket.id].roomNames) {
            clients[socket.id].roomNames = []
        }
        clients[socket.id].roomNames?.push(roomName)

        // TODO: emit to all clients
        io.emit("rooms", rooms)
        io.emit("clients", getClients())
    })

    socket.on("join_room", (roomName: string) => {
        // Check if the room exists
        const room = rooms[roomName]
        if (!room) {
            socket.emit("error", "Room does not exist")
        } else {
            // Join the room
            socket.join(roomName)
            // Update the client's room property
            if (!clients[socket.id].roomNames) {
                clients[socket.id].roomNames = []
            }
            clients[socket.id].roomNames?.push(roomName)
            // update room's clientIds
            room.clientIds.push(socket.id)
            // Send a confirmation message to all client in room
            io.to(roomName).emit("broadcast", {
                message: `${clients[socket.id].name} has joined the room`,
                roomName: roomName,
            })

            io.emit("rooms", rooms)
            io.emit("clients", getClients())
        }
    })

    socket.on("leave_room", (roomName: string) => {
        const client = clients[socket.id]
        if (client.roomNames?.includes(roomName)) {
            socket.leave(roomName!) // Leave the room

            leaveRoom(socket.id, roomName)
            // Send a confirmation message to the client
            io.to(roomName).emit("broadcast", {
                message: `${clients[socket.id].name} has left the room`,
                roomName: roomName,
            })

            io.emit("rooms", rooms)
            io.emit("clients", getClients())
        }
    })

    socket.on(
        "kick",
        ({ clientId, roomName }: { clientId: string; roomName: string }) => {
            const client = clients[socket.id]
            const kickedClient = clients[clientId]
            if (client && kickedClient) {
                if (
                    client.roomNames?.includes(roomName) &&
                    kickedClient.roomNames?.includes(roomName)
                ) {
                    leaveRoom(clientId, roomName)
                    io.to(clientId).emit("kicked", {
                        roomName: roomName,
                    })
                    kickedClient.socket.leave(roomName)

                    io.to(roomName).emit("broadcast", {
                        message: `${kickedClient.name} has been kicked from the room`,
                        roomName: roomName,
                    })

                    io.emit("rooms", rooms)
                    io.emit("clients", getClients())
                }
            }
        }
    )

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        const disconnectedClient = clients[socket.id]
        delete clients[socket.id]
        const roomNames = disconnectedClient.roomNames
        if (roomNames && roomNames.length > 0) {
            roomNames.forEach((roomName) => {
                socket.leave(roomName)
                io.to(roomName).emit("broadcast", {
                    message: `${disconnectedClient.name} has left the room`,
                    roomName: roomName,
                })
                rooms[roomName].clientIds = rooms[roomName].clientIds.filter(
                    (id) => id !== socket.id
                )
            })
        }
        io.emit("clients", getClients())
        io.emit("rooms", rooms)
    })
})

server.listen(3001, "0.0.0.0", () => {
    console.log("Server is running on port 3001")
})
