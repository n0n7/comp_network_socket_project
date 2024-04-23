import { useSocketStore } from "@/stores/socketStore";

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

    const handleJoinRoom = (roomName: string) => {
        console.log(`Joining room ${roomName}`);
        socket!.emit("join_room", roomName);
        setJoinedRoomList([...joinedRoomList, roomName]);
    };

    return (
        <div>
            <h2 className="text-lg font-medium">Public chat</h2>
            <ul>
                {Object.values(rooms).map((room) => {
                    const isJoined = joinedRoomList.includes(room.name);

                    return (
                        <div className="flex justify-between" key={room.name}>
                            <div>
                                {room.name} ({room.clientIds.length}){" "}
                            </div>
                            <div>
                                {selectedRoom === room.name ? (
                                    <></>
                                ) : (
                                    <button
                                        className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                                        onClick={() => {
                                            if (!isJoined) {
                                                handleJoinRoom(room.name);
                                            }
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
        </div>
    );
}
