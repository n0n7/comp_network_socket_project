import { useUser } from "@/hooks/useUser"
import { useState } from "react"

export default function JoinServerPage({
    handleSubmit,
}: {
    handleSubmit: (nickname: string) => void
}) {
    const { user, logout } = useUser()

    const [nickname, setNickname] = useState("")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
    }

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {user?.username}</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(nickname)
                }}
            >
                <div>
                    <label>Nickname</label>
                    <input
                        type="text"
                        placeholder={user?.username}
                        name="nickname"
                        value={nickname}
                        onChange={handleChange}
                    />
                    <button type="submit">Join</button>
                </div>
            </form>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
