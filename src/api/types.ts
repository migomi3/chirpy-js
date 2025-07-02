export type LoginInput = {
    password: string;
    email: string;
}

export type User = LoginInput & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SecureUser = Omit<User, "password">