import { Request, Response } from "express"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseconfig"

interface User {
    email: string
    username: string
    experience: number
    password: string
}

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
            experience: 0,
            password, // Note: Storing passwords in plaintext is not recommended in production
        })

        const newUserQuerySnapshot = await getDocs(
            query(usersRef, where("email", "==", email))
        )
        const newUserDoc = newUserQuerySnapshot.docs[0]
        const newUser = newUserDoc.data()
        const uid = newUserDoc.id

        res.status(201).json({
            message: "User created successfully",
            user: {
                ...newUser,
                uid,
            },
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

export async function signin(
    req: Request<{}, {}, SignInRequestBody>,
    res: Response
) {
    try {
        // check if request has email and password
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
        const uid = existingUser.docs[0].id
        

        if (user.password !== password) {
            return res.status(400).json({ error: "Incorrect password" })
        }
        
        res.status(200).json({
            message: "User signed in successfully",
            user: {
                ...user,
                uid,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getUser(uid: string): Promise<User> {
    if (uid === "") {
        return {
            email: "",
            username: "",
            experience: 0,
            password: "",
        }
    }
    const userDocRef = doc(db, "users", uid)
    const user = await getDoc(userDocRef)
    console.log(user.data())
    return user.data() as User
}

export async function updateUser(uid: string, data: Partial<User>) {
    const userDocRef = doc(db, "users", uid)
    const user = await getDoc(userDocRef)
    if (!user.exists()) {
        throw new Error("User not found")
    }
    await updateDoc(userDocRef, data)
}

