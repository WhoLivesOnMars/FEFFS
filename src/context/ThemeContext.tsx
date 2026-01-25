import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/src/context/AuthContext";

export type ThemeMode = "light" | "dark" | "system";

export type ThemeContextType = {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

const STORAGE_KEY_PREFIX = "APP_THEME_V2";

function buildStorageKey(email?: string | null): string | null {
    if (!email) return null;
    return `${STORAGE_KEY_PREFIX}_${email}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                           children,
                                                                       }) => {
    const { user } = useAuth(); // кто сейчас залогинен
    const [theme, setThemeState] = useState<ThemeMode>("light");

    useEffect(() => {
        const loadTheme = async () => {
            if (!user || !user.email) {
                setThemeState("light");
                return;
            }

            try {
                const key = buildStorageKey(user.email);
                if (!key) {
                    setThemeState("light");
                    return;
                }

                const stored = await AsyncStorage.getItem(key);
                if (
                    stored === "light" ||
                    stored === "dark" ||
                    stored === "system"
                ) {
                    setThemeState(stored);
                } else {
                    setThemeState("light");
                }
            } catch (e) {
                console.log("Error loading theme", e);
                setThemeState("light");
            }
        };

        loadTheme();
    }, [user]);

    const setTheme = async (mode: ThemeMode) => {
        setThemeState(mode);

        try {
            if (user?.email) {
                const key = buildStorageKey(user.email);
                if (key) {
                    await AsyncStorage.setItem(key, mode);
                }
            }
        } catch (e) {
            console.log("Error saving theme", e);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme(): ThemeContextType {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return ctx;
}