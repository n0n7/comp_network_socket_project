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

            socket.on("message", (message: Message) => {
                console.log("Message received", message);
                if (message.type === "private") {
                    const privateMsgs = socketStore.privateMessage;
                    if (!privateMsgs[message.senderId]) {
                        privateMsgs[message.senderId] = [];
                    }
                    privateMsgs[message.senderId].push(message);
                    socketStore.setPrivateMessage(privateMsgs);
                }
                if (message.type === "public") {
                    const roomMsgs = socketStore.roomsMesages;
                    if (!roomMsgs[message.roomName!]) {
                        roomMsgs[message.roomName!] = [];
                    }
                    roomMsgs[message.roomName!].push(message);

                    socketStore.setRoomsMessages(roomMsgs);
                }
            });

            socket.on(
                "broadcast",
                (message: { message: string; roomName: string }) => {
                    // TODO: broadcast message
                }
            );

            socket.on("kicked", ({ roomName }: { roomName: string }) => {
                alert("You have been kicked from the room");
                const roomNameList = socketStore.joinedRoomList.filter(
                    (name) => name !== roomName
                );
                socketStore.setJoinedRoomList(roomNameList);
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
