import { User } from "./types";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API;

type SignUpData = {
    username: string;
    email: string;
    password: string;
};

type LoginData = {
    email: string;
    password: string;
};

export class UserService {
    static async signUp(payload: SignUpData) {
        const res = await axios.post<{ user: User }>(
            `${baseURL}/auth/signup`,
            payload
        );

        return res;
    }
    static async login(payload: LoginData) {
        const res = await axios.post<{ user: User }>(
            `${baseURL}/auth/signin`,
            payload
        );

        return res;
    }

    static async getMe(token: string): Promise<User> {
        const { data } = await axios.get<User>(`${baseURL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data;
    }
}
