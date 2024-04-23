import { useDmStore } from "@/stores/directMessageStore";
import { useRoomStatusStore } from "@/stores/roomStatusStore";
import { useSocketStore } from "@/stores/socketStore";
import { useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

export default function ClientList() {
    const {
        clients,
        nickname,
        privateMessage,
        setPrivateMessage,
        setSelectedRoom,
    } = useSocketStore();
    const [showedClients, setShowedClients] = useState(true);
    const { setClientId, setClientName } = useDmStore();
    const { setIsDm, setIsGroup } = useRoomStatusStore();

    const selectDmHandler = (clientId: string, clientName: string) => {
        setClientId(clientId);
        setClientName(clientName);
        if (!privateMessage[clientId]) {
            setPrivateMessage({ ...privateMessage, [clientId]: [] });
        }
        setSelectedRoom("");
        setIsDm(true);
        setIsGroup(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
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
                        <div className="flex justify-between my-1">
                            <div className="flex items-center" key={client.id}>
                                <IoArrowForwardCircleOutline className="mr-2" />
                                {client.name}{" "}
                            </div>
                            <div>
                                {client.name !== nickname ? (
                                    <button
                                        className="border-2 border-gray-300 rounded-md p-1/2 bg-green-700 text-white px-1"
                                        onClick={() =>
                                            selectDmHandler(
                                                client.id,
                                                client.name
                                            )
                                        }
                                    >
                                        DM
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    ))}
                </ul>
            ) : (
                <></>
            )}
        </div>
    );
}
