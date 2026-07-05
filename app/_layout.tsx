import React from "react";
import { Platform, StyleSheet, View } from "react-native";
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
            <Stack screenOptions={{ headerShown: false }} />
            {!hideBottomNav && <BottomNavBar />}
        </View>
    );
}

function WebPhoneFrame({ children }: { children: React.ReactNode }) {
    if (Platform.OS !== "web") {
        return <>{children}</>;
    }

    return (
        <View style={styles.webPage}>
            <View style={styles.phoneFrame}>{children}</View>
        </View>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <WebPhoneFrame>
                    <RootLayoutInner />
                </WebPhoneFrame>
            </ThemeProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    webPage: {
        flex: 1,
        minHeight: "100vh" as any,
        backgroundColor: "#111111",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    phoneFrame: {
        width: "100%",
        maxWidth: 390,
        height: 844,
        maxHeight: "calc(100vh - 48px)" as any,
        backgroundColor: "#ffffff",
        borderRadius: 36,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)" as any,
    },
});