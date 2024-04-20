import { Request, Response } from "express"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseconfig"

interface SignUpRequestBody {
    email: string
    username: string
    password: string
}

export async function signup(
    req: Request<{}, {}, SignUpRequestBody>,
    res: Response
) {
    try {
        // check if request has email, username, and password
        console.log("body", req.body)
        const { email, username, password } = req.body
        if (!email || !username || !password) {
            return res.status(400).json({
                error: "Email, username, and password are required",
            })
        }

        // Check if email already exists
        const usersRef = collection(db, "users")
        const existingUser = await getDocs(
            query(usersRef, where("email", "==", email))
        )
        if (!existingUser.empty) {
            return res.status(400).json({ error: "Email already exists" })
        }

        await addDoc(usersRef, {
            username,
            email,
            level: 0,
            password, // Note: Storing passwords in plaintext is not recommended in production
        })

        const newUserQuerySnapshot = await getDocs(
            query(usersRef, where("email", "==", email))
        )
        const newUserDoc = newUserQuerySnapshot.docs[0]
        const newUser = newUserDoc.data()

        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

interface SignInRequestBody {
    email: string
    password: string
}

interface SignInRequestBody {
    email: string
    password: string
}

export async function signin(
    req: Request<{}, {}, SignInRequestBody>,
    res: Response
) {
    try {
        // check if request has email and password
        console.log("body", req.body)
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            })
        }

        // Check if email exists
        const usersRef = collection(db, "users")
        const existingUser = await getDocs(
            query(usersRef, where("email", "==", email))
        )
        if (existingUser.empty) {
            return res.status(400).json({ error: "User not found" })
        }

        const user = existingUser.docs[0].data()
        if (user.password !== password) {
            return res.status(400).json({ error: "Incorrect password" })
        }

        // Generate JWT token

        res.status(200).json({
            user,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
