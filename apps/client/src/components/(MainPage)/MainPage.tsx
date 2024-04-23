import React, { useState } from "react";
import ChatRoom from "./_components/ChatRoom";
import SelectRoom from "./_components/SelectRoom";
import ClientList from "./_components/ClientList";
import RoomList from "./_components/RoomList";
import { useSocketStore } from "@/stores/socketStore";
import RoomInfo from "./_components/RoomInfo";
import DmRoom from "./_components/DmRoom";
import { useRoomStatusStore } from "@/stores/roomStatusStore";
import { useDmStore } from "@/stores/directMessageStore";

type Props = {};

export default function MainPage({}: Props) {
    const { isDm, isGroup } = useRoomStatusStore();
    const { clientId } = useDmStore();
    const { selectedRoom } = useSocketStore();
    return (
        <>
            <div className="text-2xl font-bold mb-1">Main Page</div>
            {isDm && clientId ? (
                <DmRoom />
            ) : (
                <div>
                    <div className="mb-4">
                        {selectedRoom !== "" && isGroup ? (
                            <ChatRoom roomName={selectedRoom} />
                        ) : (
                            <SelectRoom />
                        )}
                    </div>
                </div>
            )}
            <div className="mb-4">
                <ClientList />
            </div>
            <RoomList />
            {selectedRoom !== "" && isGroup ? (
                <RoomInfo roomName={selectedRoom} />
            ) : (
                <></>
            )}
        </>
    );
}
