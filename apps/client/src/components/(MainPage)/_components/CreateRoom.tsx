import { useSocketStore } from "@/stores/socketStore";
import React, { useState } from "react";

type Props = {};

export default function CreateRoom({}: Props) {
    const {
        socket,
        joinedRoomList,
        setJoinedRoomList,
        setSelectedRoom,
        roomsMesages,
        setRoomsMessages,
    } = useSocketStore()

    const [roomNameInput, setRoomNameInput] = useState("");

    const handleSubmit = () => {
        if (roomNameInput) {
            socket!.emit("create_room", roomNameInput)
            setJoinedRoomList([...joinedRoomList, roomNameInput])
            setSelectedRoom(roomNameInput)
            const roomMsgs = roomsMesages[roomNameInput]
            if (!roomMsgs) {
                setRoomsMessages({
                    ...roomsMesages,
                    [roomNameInput]: [],
                })
            }
        }
    };
    return (
        <div>
            <div className="flex w-full">
                <input
                    className="border-2 border-gray-300 px-1 rounded-lg w-full"
                    type="text"
                    placeholder="Room name"
                    onChange={(e) => {
                        setRoomNameInput(e.target.value);
                    }}
                />
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1"
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
}
