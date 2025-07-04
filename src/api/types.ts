
export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    email: string;
    token: string;
}

export type SecureUser = Omit<User, "password">
export type LoginInput = Omit<User, "id" | "createdAt" | "updatedAt"> & {
    expiresInSeconds?: number;
}