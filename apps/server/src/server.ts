// src/server.ts
import { Server, Socket } from "socket.io"
import http from "http"

const server = http.createServer()
const io = new Server(server)

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
