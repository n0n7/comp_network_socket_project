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
            <div className="w-3/12 h-full bg-slate-200 p-2">
                <div>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                            type="submit"
                        >
                            Sign In
                        </button>
                        <button
                            className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                            onClick={() => router.push("/signup")}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
