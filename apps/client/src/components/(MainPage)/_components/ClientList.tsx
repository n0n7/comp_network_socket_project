import { useSocketStore } from "@/stores/socketStore";
import { useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

export default function ClientList() {
    const { clients } = useSocketStore();
    const [showedClients, setShowedClients] = useState(true);

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Online User</h2>
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 ml-2 bg-orange-600 text-white px-1"
                    onClick={() => setShowedClients(!showedClients)}
                >
                    {showedClients ? "Hide" : "Show"}
                </button>
            </div>
            {showedClients ? (
                <ul>
                    {Object.values(clients).map((client) => (
                        <div className="flex text-center" key={client.id}>
                            <IoArrowForwardCircleOutline className="mr-2" />
                            {client.name}{" "}
                        </div>
                    ))}
                </ul>
            ) : (
                <></>
            )}
        </div>
    );
}
