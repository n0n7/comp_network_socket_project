import { useDmStore } from "@/stores/directMessageStore"
import { useRoomStatusStore } from "@/stores/roomStatusStore"
import { useSocketStore } from "@/stores/socketStore"
import React, { useEffect, useRef, useState } from "react"

type Props = {}

export default function DmRoom({}: Props) {
    const { clients, socket, privateMessage, setPrivateMessage } =
        useSocketStore()
    const { setIsDm } = useRoomStatusStore()
    const { clientId, clientName } = useDmStore()
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const messages = privateMessage[clientId!]

    const msgLength = privateMessage[clientId!]?.length ?? 0

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
    }, [msgLength])

    const switchRoomHandler = () => {
        setIsDm(false)
    }

    const [msg, setMsg] = useState("")
    const sendMessage = (text: string) => {
        socket!.emit("message", {
            message: text,
            clientIds: clientId,
        })

        privateMessage[clientId!].push({
            senderId: socket!.id ?? "",
            message: text,
            type: "private",
        })
        setMsg("")
    }

    return (
        <>
            <div className="flex justify-between items-center w-full p-1 rounded-md bg-slate-400 px-2">
                <div className="text-md font-semibold">{clientName}</div>
                <div>
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1"
                        onClick={switchRoomHandler}
                    >
                        Back
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
            <div className="flex justify-between bg-slate-400 rounded-md gap-1 p-1 mb-2">
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
                    onClick={() => sendMessage(msg)}
                >
                    Send
                </button>
            </div>
        </>
    )
}
