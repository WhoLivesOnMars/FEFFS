import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { BottomNavBar } from "../src/components/navigation/BottomNavBar";

export default function RootLayout() {
    return (
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
    );
}