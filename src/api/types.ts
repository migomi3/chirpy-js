
export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    email: string;
}

export type SecureUser = Omit<User, "password"> & { 
    token: string;
    refreshToken: string;
}
export type LoginInput = Omit<User, "id" | "createdAt" | "updatedAt"> 