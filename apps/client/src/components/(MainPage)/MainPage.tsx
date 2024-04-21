import React, { useState } from "react";
import ChatRoom from "./_components/ChatRoom";
import SelectRoom from "./_components/SelectRoom";

type Props = {};

export default function MainPage({}: Props) {
    const [pageState, setPageState] = useState("SelectRoom");
    return (
        <>
            <div>Main Page</div>
            <div>
                {pageState === "SelectRoom" ? <SelectRoom /> : <ChatRoom />}
            </div>
        </>
    );
}
