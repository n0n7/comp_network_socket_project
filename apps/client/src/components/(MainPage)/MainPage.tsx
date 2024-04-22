import React, { useState } from "react";
import ChatRoom from "./_components/ChatRoom";
import SelectRoom from "./_components/SelectRoom";
import ClientList from "./_components/ClientList";
import RoomList from "./_components/RoomList";
import { useSocketStore } from "@/stores/socketStore";
import RoomInfo from "./_components/RoomInfo";

type Props = {};

export default function MainPage({}: Props) {
    const [pageState, setPageState] = useState("SelectRoom");
    const { roomName } = useSocketStore();
    return (
        <>
            <div className="text-2xl font-bold mb-1">Main Page</div>
            <div className="mb-4">
                {roomName === "" ? <SelectRoom /> : <ChatRoom />}
            </div>
            <div className="mb-4">
                <ClientList />
            </div>

            {roomName === "" ? <RoomList /> : <RoomInfo />}
        </>
    );
}
