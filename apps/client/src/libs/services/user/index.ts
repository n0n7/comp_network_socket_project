import { User } from "./types"
import axios from "axios"

const baseURL = "http://localhost:3001"

type SignUpData = {
    username: string
    email: string
    password: string
}

type LoginData = {
    email: string
    password: string
}

export class UserService {
    static async signUp(payload: SignUpData) {
        const res = await axios.post<{ user: User }>(`${baseURL}/signup`, payload)

        return res
    }
    static async login(payload: LoginData) {
        const res = await axios.post<{ user: User }>(`${baseURL}/signin`, payload)

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
