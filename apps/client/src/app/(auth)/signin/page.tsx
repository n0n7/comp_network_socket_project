"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login } = useUser();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login(formData);
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-[30%] h-full bg-slate-200 p-2">
                <div>
                    <h1 className="text-xl font-bold mb-2">Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between">
                            <label className="font-semibold">Email</label>
                            <input
                                className="border-2 border-gray-400 rounded-md px-1"
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex  justify-between mb-2">
                            <label className="font-semibold">Password</label>
                            <input
                                className="border-2 border-gray-400 rounded-md px-1"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="border-2 border-gray-400 rounded-md p-1/2 bg-gray-600 text-white px-1"
                                type="submit"
                            >
                                Sign In
                            </button>
                            <button
                                className="border-2 border-gray-400 rounded-md p-1/2 bg-gray-600 text-white px-1"
                                onClick={() => router.push("/signup")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
