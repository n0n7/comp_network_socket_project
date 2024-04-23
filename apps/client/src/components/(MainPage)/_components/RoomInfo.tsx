import { useSocketStore } from "@/stores/socketStore";
import { useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useDmStore } from "@/stores/directMessageStore";

type Props = {
    roomName: string;
};

export default function RoomInfo({ roomName }: Props) {
    const { rooms, clients, nickname } = useSocketStore();
    const [showedInfo, setShowedInfo] = useState(true);

    const room = rooms[roomName];
    if (!room) return <></>;

    const clientInRoom = room.clientIds.map((clientId) => clients[clientId]);

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Room Info</h2>
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 ml-2 bg-orange-600 text-white px-1"
                    onClick={() => setShowedInfo(!showedInfo)}
                >
                    {showedInfo ? "Hide" : "Show"}
                </button>
            </div>
            {showedInfo ? (
                <div>
                    <h3 className="text-md font-semibold">
                        Room Name:{" "}
                        <span className="font-normal">{roomName}</span>
                    </h3>
                    <h3 className="font-semibold">
                        Number of members:{" "}
                        <span className="font-normal">
                            {clientInRoom.length}
                        </span>
                    </h3>
                    <div className="font-semibold">Member List</div>
                    <ul>
                        {clientInRoom.map((client) => {
                            if (!client) return <></>;
                            return (
                                <div
                                    className="flex justify-between"
                                    key={client.id}
                                >
                                    <div className="flex">
                                        <IoArrowForwardCircleOutline className="mr-2" />{" "}
                                        {client.name}
                                    </div>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
function useDirectMessageStore(): { clientId: any; setClientId: any } {
    throw new Error("Function not implemented.");
}
