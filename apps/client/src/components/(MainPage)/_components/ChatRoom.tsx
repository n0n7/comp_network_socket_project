import { useSocket } from "@/hooks/useSocket"
import { useDmStore } from "@/stores/directMessageStore"
import { useRoomStatusStore } from "@/stores/roomStatusStore"
import { useSocketStore } from "@/stores/socketStore"
import React, { useEffect, useRef, useState } from "react"

type Props = {
    roomName: string
}

export default function ChatRoom({ roomName }: Props) {
    const {
        rooms,
        clients,
        joinedRoomList,
        setJoinedRoomList,
        setSelectedRoom,
        socket,
        roomsMesages,
    } = useSocketStore()
    const room = rooms[roomName]
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const { setIsGroup } = useRoomStatusStore()

    const handleLeaveRoom = () => {
        console.log(`Leaving room ${roomName}`)
        socket!.emit("leave_room", roomName)
        const roomNameList = joinedRoomList.filter((name) => name !== roomName)
        setJoinedRoomList(roomNameList)
        setSelectedRoom("")
    }

    const [msg, setMsg] = useState("")
    const sendMessage = (text: string) => {
        if (msg === "") return
        socket!.emit("message", {
            message: text,
            roomName: roomName,
        })
        setMsg("")
    }

    const handleBack = () => {
        setSelectedRoom("")
        setIsGroup(false)
    }

    const msgLength = roomsMesages[roomName]?.length ?? 0

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
        console.log("scrolling")
    }, [msgLength])

    if (!room || !roomsMesages[roomName])
        return (
            <>
                <div>ChatRoom Not Found</div>
                <button onClick={handleLeaveRoom}>Leave</button>
            </>
        )

    const messages = roomsMesages[roomName]

    return (
        <>
            <div className="flex justify-between p-1 rounded-md bg-slate-400">
                <div className="text-md font-semibold">
                    ChatRoom {room.name} ({room.clientIds.length})
                </div>
                <div className="flex gap-1">
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1"
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-red-600 text-white px-1"
                        onClick={handleLeaveRoom}
                    >
                        Leave
                    </button>
                </div>
            </div>
            <div
                className="flex flex-col bg-slate-100 px-2 h-[300px] w-full overflow-scroll"
                ref={chatContainerRef}
            >
                {messages.map((message, index) => (
                    <div key={index}>
                        <b className={``}>
                            {clients[message.senderId]?.name ?? "unknown"}
                        </b>
                        : {message.message}
                    </div>
                ))}
            </div>
            <form
                className="flex justify-between bg-slate-400 rounded-md gap-1 p-1"
                onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(msg)
                }}
            >
                <input
                    className="w-full rounded-md px-2"
                    placeholder="Type your message here"
                    type="text"
                    onChange={(e) => {
                        setMsg(e.target.value)
                    }}
                    value={msg}
                />
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </>
    )
}
