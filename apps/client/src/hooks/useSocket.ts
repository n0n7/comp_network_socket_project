import {
    Client,
    ClientsData,
    Room,
    RoomsData,
    useSocketStore,
} from "@/stores/socketStore"
import { useEffect } from "react"
import { io } from "socket.io-client"

export const useSocket = () => {
    const socketStore = useSocketStore()

    useEffect(() => {
        if (socketStore.nickname) {
            const socket = io("http://localhost:3001")

            socket.on("connect", () => {
                console.log("Socket connected")
                socket.emit("set_name", socketStore.nickname)
            })

            socket.on("clients", (clients: ClientsData) => {
                socketStore.setClients(clients)
            })

            socket.on("rooms", (rooms: RoomsData) => {
                console.log(rooms)
                socketStore.setRooms(rooms)
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
