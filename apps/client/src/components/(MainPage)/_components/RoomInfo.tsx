import { useSocketStore } from "@/stores/socketStore"

export default function RoomInfo() {
    const { rooms, socket, roomName, clients, setRoomName } = useSocketStore()

    const room = rooms[roomName]
    if (!room) return <></>

    const clientInRoom = room.clientIds.map((clientId) => clients[clientId])

    return (
        <div>
            <h2>Room Info</h2>
            <div>
                <h3>Room Name: {roomName}</h3>
                <h3>Number of Clients: {clientInRoom.length}</h3>
                <div>Client List</div>
                <ul>
                    {clientInRoom.map((client) => {
                        if (!client) return <></>
                        return <li key={client.id}>{client.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}
