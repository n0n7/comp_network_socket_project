"use client";

import MainPage from "@/components/(MainPage)/MainPage";
import JoinServerPage from "@/components/JoinServerPage";
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useSocketStore } from "@/stores/socketStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
    const { user, isLoggedIn, login, logout } = useUser();

    const router = useRouter();

    const { nickname, setNickname, reset } = useSocketStore();

    useSocket();

    useEffect(() => {
        if (!isLoggedIn) {
            reset();
            router.push("/signin");
        }
    }, [isLoggedIn, router, reset]);

    if (!nickname) {
        return (
            <div>
                <JoinServerPage
                    handleSubmit={(newNickName) => setNickname(newNickName)}
                />
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-[30%] bg-slate-200 p-2">
                <div>
                    <h1 className="text-3xl font-bold">Home</h1>
                    <p>
                        Welcome,{" "}
                        <span className="font-semibold">{nickname}</span>
                    </p>
                </div>
                <button
                    className="border-2 border-gray-300 rounded-md p-1/2 bg-red-600 text-white px-1"
                    onClick={logout}
                >
                    Logout
                </button>
                <div className="mt-4">
                    <MainPage />
                </div>
            </div>
        </div>
    );
}
