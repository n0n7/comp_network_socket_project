import { SignInResponse, signIn } from "next-auth/react"
import { User } from "./types"
import axios from "axios"

const baseURL = "http://localhost:3001"

type SignUpData = {
    username: string
    email: string
    password: string
}

export class UserService {
    static async signUp(payload: SignUpData) {
        const res = await axios.post<string>(`${baseURL}/signup`, payload)

        return res
    }
    static async signInFn(username: string, password: string) {
        const res = await axios.post<string>(`${baseURL}/signin`, {
            username: username,
            password: password,
        })

        return res
    }

    static async login(username: string, password: string) {
        const res: SignInResponse | undefined = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        })

        if (!res?.ok) {
            throw new Error("Invalid credentials")
        }

        return res
    }

    static async getMe(token: string): Promise<User> {
        const { data } = await axios.get<User>(`${baseURL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return data
    }
}
