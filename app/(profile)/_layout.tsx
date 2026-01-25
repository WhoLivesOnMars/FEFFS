import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname, router } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";

export default function ProfileLayout() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const isEditProfile = pathname.includes("/edit");
    const isChangePassword = pathname.includes("/password");
    const isGeneralSettings = pathname.includes("/settings");
    const isTerms = pathname.includes("/terms");
    const isPrivacy = pathname.includes("/privacy");
    const isTheme = pathname.includes("/theme");

    const showBack =
        isEditProfile ||
        isChangePassword ||
        isGeneralSettings ||
        isTerms ||
        isPrivacy ||
        isTheme;

    const showLogout = !showBack;

    let title = "Profil";
    if (isEditProfile) {
        title = "Modifier le profil";
    } else if (isChangePassword) {
        title = "Modifier le mot de passe";
    } else if (isGeneralSettings) {
        title = "Paramètres généraux";
    } else if (isTerms) {
        title = "Conditions d’utilisation";
    } else if (isPrivacy) {
        title = "Politique de confidentialité";
    } else if (isTheme) {
        title = "Thème";
    }

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/(auth)/login");
        } catch (e) {
            console.log("Erreur de déconnexion :", e);
        }
    };

    return (
        <SafeAreaView
            style={[
                tw`flex-1`,
                { backgroundColor: isDark ? "#0F172A" : "#fafafa" },
            ]}
        >
            <View
                style={[
                    tw`flex-row items-center justify-between px-6 pt-3 pb-3`,
                    { backgroundColor: isDark ? "#0F172A" : "#fafafa" },
                ]}
            >
                <View style={tw`flex-row items-center`}>
                    {showBack && (
                        <Pressable onPress={() => router.back()} hitSlop={10}>
                            <Ionicons name="chevron-back" size={22} color={isDark ? "#e5e7eb" : "#111827"} />
                        </Pressable>
                    )}

                    <Text
                        style={[
                            tw`ml-2 text-xl font-semibold`,
                            { color: isDark ? "#e5e7eb" : "#111827" },
                        ]}
                    >
                        {title}
                    </Text>
                </View>

                {showLogout && (
                    <Pressable
                        onPress={handleLogout}
                        style={tw`px-3 py-2 rounded-xl bg-orange-100`}
                    >
                        <Text style={tw`text-orange-600 text-xs`}>
                            Déconnexion
                        </Text>
                    </Pressable>
                )}
            </View>

            <Slot />
        </SafeAreaView>
    );
}