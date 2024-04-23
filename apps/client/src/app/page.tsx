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

    const { nickname, setNickname, reset, clients, socket } = useSocketStore()

    const [newName, setNewName] = useState(nickname)

    const handleChangeName = () => {
        if (newName) {
            setNickname(newName)
            socket?.emit("edit_name", newName)
        }
    }

    useSocket()

    useEffect(() => {
        if (!isLoggedIn) {
            reset()
            router.push("/signin")
        } else {
            setNickname(user?.username!)
        }
    }, [isLoggedIn, router, reset])

    if (!nickname) {
        return <div></div>
    }

	const client = clients[socket?.id!];

	const experienceToLevel = (experience: number): number => {
		return Math.floor(Math.sqrt(experience));
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-[30%] h-screen bg-slate-200 p-2 overflow-y-scroll">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Home</h1>
						<p>
							Welcome,{" "}
							<span className="font-semibold">
								{nickname} Level:{" "}
								{experienceToLevel(client?.experience || 0)} (
								{client?.experience}/
								{(experienceToLevel(client?.experience || 0) +
									1) **
									2}
								)
							</span>
						</p>
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button className="border-2 border-gray-300 rounded-md p-1/2 bg-blue-600 text-white px-1" onClick={handleChangeName}>
                            change name
                        </button>
					</div>
					<div>
						<button
							className="border-2 border-gray-300 rounded-md p-1/2 bg-red-600 text-white px-1"
							onClick={logout}
						>
							Logout
						</button>
					</div>
				</div>

                <div className="mt-4">
                    <MainPage />
                </div>
            </div>
        </div>
    )
}
