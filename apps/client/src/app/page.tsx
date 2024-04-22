"use client"

import MainPage from "@/components/(MainPage)/MainPage"
import JoinServerPage from "@/components/JoinServerPage"
import { useSocket } from "@/hooks/useSocket"
import { useUser } from "@/hooks/useUser"
import { useSocketStore } from "@/stores/socketStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import io from "socket.io-client"

export default function Home() {
    const { user, isLoggedIn, login, logout } = useUser()

    const router = useRouter()

    const { nickname, setNickname, reset } = useSocketStore()

    useSocket()

    useEffect(() => {
        if (!isLoggedIn) {
            reset()
            router.push("/signin")
        }
    }, [isLoggedIn, router, reset])

    if (!nickname) {
        return (
            <JoinServerPage
                handleSubmit={(newNickName) => setNickname(newNickName)}
            />
        )
    }
    return (
        <>
            <div>
                <h1>Home</h1>
                <p>Welcome, {nickname}</p>
                <button onClick={logout}>Logout</button>
            </div>
            <div>
                <MainPage />
            </div>
        </>
    )
}
