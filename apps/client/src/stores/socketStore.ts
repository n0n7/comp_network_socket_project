import { Socket } from "socket.io-client"
import { create } from "zustand"

export type Client = {
    id: string
    name: string
    roomName?: string
}

export type ClientsData = { [clientId: string]: Client }

export type Message = {
    senderId: string
    message: string
    type: string
}

export type Room = {
    name: string
    clientIds: string[]
}

export type RoomsData = { [roomName: string]: Room }

type SocketStore = {
    socket: Socket | null
    setSocket: (socket: Socket) => void
    nickname: string
    setNickname: (nickname: string) => void
    clients: ClientsData
    setClients: (clients: ClientsData) => void
    rooms: RoomsData
    setRooms: (room: RoomsData) => void
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
    clients: {},
    setClients: (clients: ClientsData) => set({ clients }),
    rooms: {},
    setRooms: (rooms: RoomsData) => set({ rooms }),
    roomName: "",
    setRoomName: (roomName: string) => set({ roomName }),
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
    reset: () =>
        set({
            socket: null,
            nickname: "",
            clients: {},
            rooms: {},
            messages: [],
            roomName: "",
        }),
}))
