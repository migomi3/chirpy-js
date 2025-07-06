
export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    email: string;
}

export type BasicUser = Omit<User, "password">
export type SecureUser = BasicUser & { 
    token: string;
    refreshToken: string;
}
export type LoginInput = Omit<User, "id" | "createdAt" | "updatedAt"> 