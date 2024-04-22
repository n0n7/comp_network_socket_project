import { useSocketStore } from "@/stores/socketStore"

export default function ClientList() {
    const { clients } = useSocketStore()

    return (
        <div>
            <h2>Client List</h2>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>{client.name}</li>
                ))}
            </ul>
        </div>
    )
}
