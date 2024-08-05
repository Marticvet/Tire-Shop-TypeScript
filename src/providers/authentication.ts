import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    firstName: null,
    lastName: null,
    setAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const createSession = (userId, firstName, lastName, token, auth) => {
    try {
        const user = jwtDecode(token);
        
        localStorage.setItem(TOKEN_KEY, token);
        auth.setAuthState({
            userId,
            firstName,
            lastName,
            token,
            auth,
            isLoggedIn: true,
        });

        return true;
    } catch (error) {
        console.warn(error);
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
