import {
    Client,
    ClientsData,
    Message,
    Room,
    RoomsData,
    useSocketStore,
} from "@/stores/socketStore";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
    const socketStore = useSocketStore();

    useEffect(() => {
        if (socketStore.nickname) {
            const socket = io("http://localhost:3001");

            socket.on("connect", () => {
                console.log("Socket connected");
                socket.emit("set_name", socketStore.nickname);
            });

            socket.on("clients", (clients: ClientsData) => {
                socketStore.setClients(clients);
            });

            socket.on("rooms", (rooms: RoomsData) => {
                console.log(rooms);
                socketStore.setRooms(rooms);
            });

            socket.on("error", (error: string) => {
                alert(error);
            });

            socket.on(
                "message",
                (message: {
                    senderId: string;
                    message: string;
                    type: string;
                }) => {
                    console.log("Message received", message);
                    const prevMessages = socketStore.messages;
                    prevMessages.push(message);
                    socketStore.setMessages(prevMessages);
                }
            );

            socket.on("broadcast", (message: string) => {
                // TODO: broadcast message
            });

            socket.on("kicked", () => {
                alert("You have been kicked from the room");
                socketStore.setRoomName("");
            });

            socket.on("error", (error: string) => {
                alert(error);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socketStore.setSocket(socket);

            return () => {
                // Clean up the socket connection when component unmounts
                socket.disconnect();
            };
        }
    }, [socketStore.nickname]);
};
