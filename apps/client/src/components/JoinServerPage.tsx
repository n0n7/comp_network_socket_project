import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export default function JoinServerPage({
    handleSubmit,
}: {
    handleSubmit: (nickname: string) => void;
}) {
    const { user, logout } = useUser();

    const [nickname, setNickname] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-3/12 h-full bg-slate-200 p-2">
                <div>
                    <h1>Home</h1>
                    <p>Welcome, {user?.username}</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(nickname);
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
                            <button
                                className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                                type="submit"
                            >
                                Join
                            </button>
                        </div>
                    </form>
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
