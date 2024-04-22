import { useSocket } from "@/hooks/useSocket";
import { useSocketStore } from "@/stores/socketStore";
import React, { useState } from "react";

type Props = {};

export default function ChatRoom({}: Props) {
    const { rooms, clients, roomName, setRoomName, socket, messages } =
        useSocketStore();
    const room = rooms[roomName];

    const handleLeaveRoom = () => {
        console.log(`Leaving room ${roomName}`);
        socket!.emit("leave_room");
        setRoomName("");
    };

    const [msg, setMsg] = useState("");
    const sendMessage = (text: string) => {
        socket!.emit("message", text);
    };

    if (!room)
        return (
            <>
                <div>ChatRoom Not Found</div>
                <button onClick={handleLeaveRoom}>Leave</button>
            </>
        );

    return (
        <>
            <div className="flex justify-between">
                <div className="text-md font-semibold">
                    ChatRoom {room.name} ({room.clientIds.length})
                </div>
                <div>
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-red-600 text-white px-1"
                        onClick={handleLeaveRoom}
                    >
                        Leave
                    </button>
                </div>
            </div>
            <div className="bg-slate-100 px-2 mb-2">
                {messages.map((message, index) => (
                    <div key={index}>
                        <b>{clients[message.senderId]?.name ?? "unknown"}</b>:{" "}
                        {message.message}
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <input
                    className="w-full rounded-md px-2"
                    placeholder="Type your message here"
                    type="text"
                    onChange={(e) => {
                        setMsg(e.target.value);
                    }}
                />
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1"
                    onClick={() => sendMessage(msg)}
                >
                    Send
                </button>
            </div>
        </>
    );
}
