import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { BottomNavBar } from "../src/components/navigation/BottomNavBar";

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <View style={{ flex: 1 }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                    {/* Navbar visible sur toutes les pages principales */}
                    <BottomNavBar />
              </View>
            </AuthProvider>
        </ThemeProvider>
    );
}