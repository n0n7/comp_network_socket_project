import { useSocketStore } from "@/stores/socketStore"
import React from "react"

type Props = {}

export default function ChatRoom({}: Props) {
    const { rooms, roomName, setRoomName, socket } = useSocketStore()
    const room = rooms.find((room) => room.name === roomName)

    const handleLeaveRoom = () => {
        console.log(`Leaving room ${roomName}`)
        socket!.emit("leave_room")
        setRoomName("")
    }

    if (!room) return <div>ChatRoom Not Found</div>

    return (
        <>
            <div>
                ChatRoom {room.name} ({room.clientIds.length})
            </div>
            <button onClick={handleLeaveRoom}>Leave</button>
        </>
    )
}
