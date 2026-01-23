import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, StoredUser } from "../services/authService";

type AuthContextType = {
    user: { email: string } | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const existing = await getCurrentUser();
            setUser(existing); // {email} | null
            setLoading(false);
        })();
    }, []);

    const register = async (email: string, password: string) => {
        const newUser: StoredUser = await registerUser(email, password);
        setUser({ email: newUser.email });
    };

    const login = async (email: string, password: string) => {
        const u: StoredUser = await loginUser(email, password);
        setUser({ email: u.email });
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}