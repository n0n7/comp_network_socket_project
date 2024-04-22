import { useSocketStore } from "@/stores/socketStore";
import React, { useState } from "react";

type Props = {};

export default function CreateRoom({}: Props) {
    const { socket, setRoomName } = useSocketStore();

    const [roomNameInput, setRoomNameInput] = useState("");

    const handleSubmit = () => {
        if (roomNameInput) {
            socket!.emit("create_room", roomNameInput);
            setRoomName(roomNameInput);
        }
    };
    return (
        <div>
            <div className="align-center">
                <input
                    className="border-2 border-gray-300 px-1 rounded-lg"
                    type="text"
                    placeholder="Room name"
                    onChange={(e) => {
                        setRoomNameInput(e.target.value);
                    }}
                />
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 ml-2 bg-blue-600 text-white px-1"
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
}
