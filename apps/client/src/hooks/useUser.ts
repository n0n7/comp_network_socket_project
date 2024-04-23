import { UserService } from "@/libs/services/user"
import { useUserStore } from "@/stores/userStore"

export const useUser = () => {
    const userStore = useUserStore()

    const login = async (data: { email: string; password: string }) => {
        const res = await UserService.login(data)
        console.log(res.data)
        userStore.setUser(res.data.user)
        userStore.setIsLoggedIn(true)
    }

    const signup = async (data: {
        username: string
        email: string
        password: string
    }) => {
        const res = await UserService.signUp(data)
        userStore.setUser(res.data.user)
        userStore.setIsLoggedIn(true)
    }

    return { login, signup, ...userStore }
}
