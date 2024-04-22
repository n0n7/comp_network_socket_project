"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { signup } = useUser();
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
            await signup(formData);
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-3/12 h-full bg-slate-200 p-2">
                <div>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                onChange={handleChange}
                            />
                        </div>
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
                        <button onClick={() => router.back()}>Back</button>
                        <button
                            className="border-2 border-gray-300 rounded-md p-1/2 bg-gray-600 text-white px-1"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
