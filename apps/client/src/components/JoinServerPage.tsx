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
            <div className="w-[30%] h-screen bg-slate-200 p-2">
                <div>
                    <h1 className="text-xl font-bold mb-2">Home</h1>
                    <p>
                        Welcome,{" "}
                        <span className="font-semibold">{user?.username}</span>{" "}
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(nickname);
                        }}
                    >
                        <div className="flex">
                            <label>Nickname:</label>
                        </div>
                        <div className="flex w-full mb-2">
                            <input
                                className="border-2 border-gray-400 rounded-md px-1 w-full"
                                type="text"
                                placeholder={user?.username}
                                name="nickname"
                                value={nickname}
                                onChange={handleChange}
                            />
                            <button
                                className="border-2 border-gray-300 rounded-md p-1/2 bg-green-600 text-white px-1"
                                type="submit"
                            >
                                Join
                            </button>
                        </div>
                    </form>
                    <button
                        className="border-2 border-gray-300 rounded-md p-1/2 bg-red-600 text-white px-1"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
