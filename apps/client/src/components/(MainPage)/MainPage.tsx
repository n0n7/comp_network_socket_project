import React, { useState } from "react";
import ChatRoom from "./_components/ChatRoom";
import SelectRoom from "./_components/SelectRoom";
import ClientList from "./_components/ClientList";
import RoomList from "./_components/RoomList";
import { useSocketStore } from "@/stores/socketStore";

type Props = {};

export default function MainPage({}: Props) {
    const [pageState, setPageState] = useState("SelectRoom");
    const { roomName } = useSocketStore();
    return (
        <>
            <div>Main Page</div>
            <div>
                {roomName === "" ? <SelectRoom /> : <ChatRoom />}
            </div>
            <ClientList />
            <RoomList />
        </>
    );
}
