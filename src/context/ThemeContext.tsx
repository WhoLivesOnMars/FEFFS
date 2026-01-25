import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "APP_THEME_V2";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeMode>("system");

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === "light" || stored === "dark" || stored === "system") {
                    setThemeState(stored);
                }
            } catch (e) {
                console.log("Error loading theme", e);
            }
        })();
    }, []);

    const setTheme = async (mode: ThemeMode) => {
        try {
            setThemeState(mode);
            await AsyncStorage.setItem(STORAGE_KEY, mode);
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