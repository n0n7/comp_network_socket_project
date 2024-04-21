import { useNicknameStore } from "@/stores/nicknameStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
    const { nickname } = useNicknameStore();

    useEffect(() => {
        if (!nickname) return;

        const socket = io("http://localhost:3001");

        socket.on("connect", () => {
            console.log("Socket connected");
            socket.emit("set_name", nickname);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return () => {
            // Clean up the socket connection when component unmounts
            socket.disconnect();
        };
    }, [nickname]);
};
