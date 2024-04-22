import { useSocketStore } from "@/stores/socketStore"
import React, { useState } from "react"

type Props = {}

export default function CreateRoom({}: Props) {
    const { socket, setRoomName } = useSocketStore()

    const [roomNameInput, setRoomNameInput] = useState("")

    const handleSubmit = () => {
        if (roomNameInput) {
            socket!.emit("create_room", roomNameInput)
            setRoomName(roomNameInput)
        }
    }
    return (
        <div>
            <div className="flex">
                <input
                    type="text"
                    placeholder="Room name"
                    onChange={(e) => {
                        setRoomNameInput(e.target.value)
                    }}
                />
                <button onClick={handleSubmit}>Create</button>
            </div>
        </div>
    )
}
