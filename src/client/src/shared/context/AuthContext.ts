import { createContext } from 'react';

export type TLogin = (userId: string, token: string, expirationDate?: Date) => void

interface IAuthContext {
    userId?: string;
    token?: string;
    login?: TLogin;
    logout?: () => void
}

export const AuthContext = createContext<IAuthContext>({
    userId: undefined,
    token: undefined,
    login: undefined,
    logout: undefined
});
