import { useRoomStatusStore } from "@/stores/roomStatusStore";
import { useSocketStore } from "@/stores/socketStore";
import { useState } from "react";

export default function RoomList() {
    const {
        rooms,
        socket,
        joinedRoomList,
        roomsMesages,
        selectedRoom,
        setRoomsMessages,
        setJoinedRoomList,
        setSelectedRoom,
    } = useSocketStore();
    const [showRooms, setShowRooms] = useState(true);
    const { setIsDm, setIsGroup } = useRoomStatusStore();

    const handleJoinRoom = (roomName: string) => {
        console.log(`Joining room ${roomName}`);
        socket!.emit("join_room", roomName);
        setJoinedRoomList([...joinedRoomList, roomName]);
    };

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-lg font-medium">Public chat</h2>
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 bg-orange-500 text-white px-1"
                    onClick={() => setShowRooms(!showRooms)}
                >
                    {showRooms ? "Hide" : "Show"}
                </button>
            </div>
            {showRooms ? (
                <ul>
                    {Object.values(rooms).map((room) => {
                        const isJoined = joinedRoomList.includes(room.name);

                        return (
                            <div
                                className="flex justify-between items-center"
                                key={room.name}
                            >
                                <div>
                                    {room.name} ({room.clientIds.length}){" "}
                                </div>
                                <div>
                                    {selectedRoom === room.name ? (
                                        <></>
                                    ) : (
                                        <button
                                            className="border-2 border-gray-300 rounded-md p-1/2 bg-green-700 text-white px-1"
                                            onClick={() => {
                                                if (!isJoined) {
                                                    handleJoinRoom(room.name);
                                                }
                                                setIsDm(false);
                                                setIsGroup(true);
                                                setSelectedRoom(room.name);
                                                const roomMsgs =
                                                    roomsMesages[room.name];
                                                if (!roomMsgs) {
                                                    setRoomsMessages({
                                                        ...roomsMesages,
                                                        [room.name]: [],
                                                    });
                                                }
                                            }}
                                        >
                                            {isJoined ? "Enter" : "Join"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </ul>
            ) : (
                <></>
            )}
        </div>
    );
}
