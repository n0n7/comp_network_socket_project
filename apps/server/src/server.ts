// src/server.ts
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import http from "http";
import { signin, signup } from "./auth";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

app.use(cors());
app.use(express.json());

const auth = require("./router/auth");

// Authentication router
app.use("/auth", auth);

interface Client {
    id: string;
    name: string;
    socket: Socket;
}

interface ChatRoom {
    name: string;
    ids: string[];
}

const clients: Client[] = [];
const rooms: ChatRoom[] = [];

io.on("connection", (socket) => {
    console.log(`A user ${socket.id} connected`);

    socket.on("set_name", (name: string) => {
        clients.push({ id: socket.id, name, socket });
        console.log(clients);
    });

    socket.on("message", (message: string) => {
        const sender = clients.find(
            (client) => client.socket.id === socket.id
        )?.name;
        io.emit("message", { sender, message });
    });

    socket.on("boardcast", (message: string) => {
        // TODO: later
    });

    socket.on("chat-list", () => {
        io.emit("chat-list", rooms);
    });

    socket.on("create_room", (roomName: string) => {
        //TODO: later
        rooms.push({ name: roomName, ids: [socket.id] });
    });

    socket.on("join_room", (roomName: string) => {
        //TODO: later
    });

    socket.on("kick", () => {
        // TODO: later
    });

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
        const clientIndex = clients.findIndex(
            (client) => client.socket.id === socket.id
        );
        if (clientIndex !== -1) {
            clients.splice(clientIndex, 1);
            io.emit("clients", getClients());
        }
    });
});

function getClients() {
    return clients.map((client) => client.name);
}

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
