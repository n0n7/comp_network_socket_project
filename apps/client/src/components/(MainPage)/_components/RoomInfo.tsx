import { useSocketStore } from "@/stores/socketStore"

export default function RoomInfo() {
    const { rooms, socket, roomName, clients, setRoomName } = useSocketStore()

    const room = rooms.find((room) => room.name === roomName)
    const clientInRoom = clients.filter(
        (client) => client.roomName === roomName
    )

    return (
        <div>
            <h2>Room Info</h2>
            <div>
                <h3>Room Name: {roomName}</h3>
                <h3>Number of Clients: {clientInRoom.length}</h3>
                <div>Client List</div>
                <ul>
                    {clientInRoom.map((client) => (
                        <li key={client.id}>{client.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
