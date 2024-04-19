import { DefaultUser } from 'next-auth'

import { UserRole } from '@/libs/services/user'
import { User as UserType } from '@/libs/services/user/types'

interface IUser extends DefaultUser, Partial<UserType> {
	token?: string
}

declare module 'next-auth' {
	interface User {
		role?: UserRole
	}
	interface Session {
		user?: IUser
		token?: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultUser {
		user?: IUser
		role?: UserRole
	}
}
