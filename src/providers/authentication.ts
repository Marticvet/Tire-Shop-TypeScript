import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    setAuthState: React.Dispatch<React.SetStateAction<{
        userId: string | null;
        firstName: string | null;
        lastName: string | null;
        isLoggedIn: boolean;
    }>>;
}


const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    userId: null,
    firstName: null,
    lastName: null,
    setAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const createSession = (userId: string, firstName: string, lastName: string, token: string, auth: AuthContextType) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        auth.setAuthState({
            userId,
            firstName,
            lastName,
            isLoggedIn: true,
        });
        return true;
    } catch (error) {
        console.warn("Error during session creation:", error);
        return false;
    }
};


export const getUser = () => {
    try {
        return jwtDecode(localStorage.getItem(TOKEN_KEY) || "");
    } catch (error) {
        return null;
    }
};

export default AuthContext;