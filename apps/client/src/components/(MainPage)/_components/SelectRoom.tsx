import React from "react";
import CreateRoom from "./CreateRoom";

type Props = {};

export default function SelectRoom({}: Props) {
    return (
        <>
            <div className="text-lg font-medium">Create Room</div>

            <CreateRoom />
        </>
    );
}
