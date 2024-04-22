import { useSocketStore } from "@/stores/socketStore";

export default function RoomList() {
    const { rooms, socket, roomName, setRoomName } = useSocketStore();

    const handleJoinRoom = (roomName: string) => {
        console.log(`Joining room ${roomName}`);
        socket!.emit("join_room", roomName);
        setRoomName(roomName);
    };

    if (roomName) return <></>;

    return (
        <div>
            <h2 className="text-lg font-medium">Public chat</h2>
            <ul>
                {Object.values(rooms).map((room) => (
                    <div className="flex justify-between" key={room.name}>
                        <div>
                            {room.name} ({room.clientIds.length}){" "}
                        </div>
                        <div>
                            <button
                                className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                                onClick={() => handleJoinRoom(room.name)}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
