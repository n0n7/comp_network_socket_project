"use client"

import JoinServerPage from "@/components/JoinServerPage"
import { useSocket } from "@/hooks/useSocket"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import io from 'socket.io-client'

export default function Home() {
    const { user, isLoggedIn, login, logout } = useUser()

    const router = useRouter()

    const [nickName, setNickName] = useState("")

    useSocket(nickName)

    if (!nickName) {
        return (
            <JoinServerPage
                handleSubmit={(newNickName) => setNickName(newNickName)}
            />
        )
    }
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {nickName}</p>
            <></>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
