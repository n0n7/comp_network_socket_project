import { UserService } from "@/libs/services/user"
import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOption: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await UserService.signInFn(
                    credentials?.username ?? "",
                    credentials?.password ?? ""
                )

                const token = res.data as string
                const user = await UserService.getMe(token)

                return { ...user, token }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = user
            }

            return token
        },
        session: ({ session, token }) => {
            if (token) {
                session.user = token.user
                session.token = token?.user?.token
            }

            return session
        },
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout",
    },
}

// eslint-disable-next-line require-await
const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("cache-control", "no-store, max-age=0")

    return NextAuth(req, res, authOption)
}

export default Auth
