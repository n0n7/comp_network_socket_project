import { Socket } from "socket.io-client"
import { create } from "zustand"

export type Client = {
    id: string
    name: string
    roomName?: string
}

export type Message = {
    senderId: string
    message: string
    messageId: string
}

export type Room = {
    name: string
    clientIds: string[]
}

type SocketStore = {
    socket: Socket | null
    setSocket: (socket: Socket) => void
    nickname: string
    setNickname: (nickname: string) => void
    clients: Client[]
    setClients: (clients: Client[]) => void
    rooms: Room[]
    setRooms: (room: Room[]) => void
    roomName: string
    setRoomName: (roomName: string) => void
    messages: Message[]
    setMessages: (messages: Message[]) => void
    reset: () => void
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    setSocket: (socket: Socket) => set({ socket }),
    nickname: "",
    setNickname: (nickname: string) => set({ nickname }),
    clients: [],
    setClients: (clients: Client[]) => set({ clients }),
    rooms: [],
    setRooms: (rooms: Room[]) => set({ rooms }),
    roomName: "",
    setRoomName: (roomName: string) => set({ roomName }),
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
    reset: () =>
        set({
            socket: null,
            nickname: "",
            clients: [],
            rooms: [],
            roomName: "",
            messages: [],
        }),
}))
