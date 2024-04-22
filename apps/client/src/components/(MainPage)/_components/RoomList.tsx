import { useSocketStore } from "@/stores/socketStore"

export default function RoomList() {
    const { rooms, socket, roomName, setRoomName } = useSocketStore()

    const handleJoinRoom = (roomName: string) => {
        console.log(`Joining room ${roomName}`)
        socket!.emit("join_room", roomName)
        setRoomName(roomName)
    }

    if (roomName) return <></>

    return (
        <div>
            <h2>Room List</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.name}>
                        {room.name} ({room.clientIds.length}){" "}
                        <button onClick={() => handleJoinRoom(room.name)}>
                            Join
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
