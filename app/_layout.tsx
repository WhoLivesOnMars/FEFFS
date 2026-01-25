import React from "react";
import { View } from "react-native";
import { Stack, useSegments } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { BottomNavBar } from "../src/components/navigation/BottomNavBar";

function RootLayoutInner() {
    const segments = useSegments();

    const root = segments[0] ?? "";
    const sub = segments[1];

    const inAuthGroup = root === "(auth)";
    const inProfileGroup = root === "(profile)";

    const isProfileRoot = inProfileGroup && !sub;
    const isProfileSubpage = inProfileGroup && !!sub;

    const hideBottomNav = inAuthGroup || isProfileSubpage;

    return (
        <View style={{ flex: 1 }}>
            <Stack />
            {!hideBottomNav && <BottomNavBar />}
        </View>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootLayoutInner />
            </AuthProvider>
        </ThemeProvider>
    );
}