"use client"

import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const { login } = useUser()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await login(formData)
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }
    return (
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
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}
