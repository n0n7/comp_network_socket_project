import {
    Client,
    ClientsData,
    Message,
    Room,
    RoomsData,
    useSocketStore,
} from "@/stores/socketStore"
import { useUserStore } from "@/stores/userStore"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useSocket = () => {
    const socketStore = useSocketStore()
    const userStore = useUserStore()

    useEffect(() => {
        if (socketStore.nickname) {
            const socket = io(process.env.NEXT_PUBLIC_API || "")

            socket.on("connect", () => {
                console.log("Socket connected")
                console.log(userStore.user?.uid)
                socket.emit("set_name", { name: socketStore.nickname, uid: userStore.user?.uid }) // TODO:change uid when it's ready
            })

			socket.on("clients", (clients: ClientsData) => {
				socketStore.setClients(clients);
			});

            socket.on("rooms", (rooms: RoomsData) => {
                console.log(rooms)
                socketStore.setRooms(rooms)
            })

            socket.on("error", (error: string) => {
                alert(error)
            })

            socket.on("message", (message: Message) => {
                console.log("Message received", message)
                if (message.type === "private") {
                    const privateMsgs = socketStore.privateMessage
                    if (!privateMsgs[message.senderId]) {
                        privateMsgs[message.senderId] = []
                    }
                    privateMsgs[message.senderId].push(message)
                    socketStore.setPrivateMessage(privateMsgs)
                }
                if (message.type === "public") {
                    const roomMsgs = socketStore.roomsMesages
                    if (!roomMsgs[message.roomName!]) {
                        roomMsgs[message.roomName!] = []
                    }
                    roomMsgs[message.roomName!].push(message)

                    socketStore.setRoomsMessages(roomMsgs)
                }
            })

			socket.on(
				"broadcast",
				(broadcastMessage: {
					message: string;
					roomName: string;
					type: "join" | "leave" | "kick";
					timestamp: number;
				}) => {
					// Add some logic to handle broadcast messages
					const roomsMessage = socketStore.roomsMesages;
					if (!roomsMessage[broadcastMessage.roomName]) {
						roomsMessage[broadcastMessage.roomName] = [];
					}
					roomsMessage[broadcastMessage.roomName].push({
                        senderId: "",
						message: broadcastMessage.message,
                        type: "",
						broadcastType: broadcastMessage.type,
						timestamp: broadcastMessage.timestamp,
					});

                    socketStore.setRoomsMessages(roomsMessage);
				}
			);

            socket.on("kicked", ({ roomName }: { roomName: string }) => {
                alert("You have been kicked from the room")
                const roomNameList = socketStore.joinedRoomList.filter(
                    (name) => name !== roomName
                )
                socketStore.setJoinedRoomList(roomNameList)
            })

            socket.on("error", (error: string) => {
                alert(error)
            })

            socket.on("disconnect", () => {
                console.log("Socket disconnected")
            })

            socketStore.setSocket(socket)

            return () => {
                // Clean up the socket connection when component unmounts
                socket.disconnect()
            }
        }
    }, [socketStore.nickname])
}
