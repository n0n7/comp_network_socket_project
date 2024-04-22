import { useSocket } from "@/hooks/useSocket"
import { useSocketStore } from "@/stores/socketStore"
import React, { useState } from "react"

type Props = {}

export default function ChatRoom({}: Props) {
    const { rooms, clients, roomName, setRoomName, socket, messages } =
        useSocketStore()
    const room = rooms[roomName]

    const handleLeaveRoom = () => {
        console.log(`Leaving room ${roomName}`)
        socket!.emit("leave_room")
        setRoomName("")
    }

    const [msg, setMsg] = useState("")
    const sendMessage = (text: string) => {
        socket!.emit("message", text)
    }

    if (!room)
        return (
            <>
                <div>ChatRoom Not Found</div>
                <button onClick={handleLeaveRoom}>Leave</button>
            </>
        )

    return (
        <>
            <div>
                ChatRoom {room.name} ({room.clientIds.length})
            </div>
            {messages.map((message, index) => (
                <div key={index}>
                    <b>{clients[message.senderId]?.name ?? "unknown"}</b>:{" "}
                    {message.message}
                </div>
            ))}
            <input
                type="text"
                onChange={(e) => {
                    setMsg(e.target.value)
                }}
            />
            <button onClick={() => sendMessage(msg)}>Send</button>
            <div>
                <button onClick={handleLeaveRoom}>Leave</button>
            </div>
        </>
    )
}
