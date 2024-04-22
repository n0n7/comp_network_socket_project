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
    roomName?: string
}

export type MessageData = { [key: string]: Message[] }

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
    setRooms: (rooms: RoomsData) => void
    joinedRoomList: string[]
    setJoinedRoomList: (joinedRoomList: string[]) => void
    roomsMesages: MessageData
    setRoomsMessages: (roomsMesages: MessageData) => void
    privateMessage: MessageData
    setPrivateMessage: (privateMessage: MessageData) => void
    selectedRoom: string
    setSelectedRoom: (selectedRoom: string) => void
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
    joinedRoomList: [],
    setJoinedRoomList: (joinedRoomList: string[]) => set({ joinedRoomList }),
    roomsMesages: {},
    setRoomsMessages: (roomsMesages: MessageData) => set({ roomsMesages }),
    privateMessage: {},
    setPrivateMessage: (privateMessage: MessageData) => set({ privateMessage }),
    selectedRoom: "",
    setSelectedRoom: (selectedRoom: string) => set({ selectedRoom }),
    reset: () =>
        set({
            socket: null,
            nickname: "",
            clients: {},
            rooms: {},
            roomsMesages: {},
            privateMessage: {},
            joinedRoomList: [],
            selectedRoom: "",
        }),
}))
