import React, { useCallback, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { getUserProfile, UserProfile } from "@/src/services/profileService";

import { useTheme } from "@/src/context/ThemeContext";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const email = user?.email ?? "";

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const load = async () => {
                if (!email) return;
                const data = await getUserProfile(email);
                if (isActive) {
                    setProfile(data ?? null);
                }
            };

            load();

            return () => {
                isActive = false;
            };
        }, [email])
    );

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/(auth)/login");
        } catch (e) {
            console.log("Erreur de déconnexion :", e);
        }
    };

    const fullName =
        profile?.fullName && profile.fullName.trim().length > 0
            ? profile.fullName
            : "Nom non renseigné";

    return (
        <View
            style={[
                tw`flex-1 px-6 pt-10`,
                { backgroundColor: isDark ? "#0F172A" : "#fafafa" },
            ]}
        >
            <View style={tw`items-center mb-8`}>
                <View
                    style={tw`w-28 h-28 rounded-full bg-orange-200 items-center justify-center mb-4`}
                >
                    {profile?.avatarUri ? (
                        <Image
                            source={{ uri: profile.avatarUri }}
                            style={tw`w-28 h-28 rounded-full`}
                        />
                    ) : (
                        <Ionicons name="person-outline" size={40} color="#f97316" />
                    )}
                </View>

                <Text
                    style={[
                          tw`text-lg font-semibold mb-1`,
                          { color: isDark ? "#e5e7eb" : "#111827" },
                    ]}
                >
                    {fullName}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>{email}</Text>
            </View>

            <View style={tw`gap-3`}>
                <Pressable
                    style={tw`flex-row items-center justify-between bg-[#EEEFF1] rounded-2xl px-4 py-3`}
                    onPress={() => router.push("/(profile)/edit")}
                >
                    <View style={tw`flex-row items-center`}>
                        <View
                            style={tw`w-8 h-8 items-center justify-center mr-3`}
                        >
                            <Ionicons
                                name="person-circle-outline"
                                size={18}
                                color="#f97316"
                            />
                        </View>
                        <Text style={tw`text-sm text-slate-900 font-regular`}>
                            Modifier le profil
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </Pressable>

                <Pressable
                    style={tw`flex-row items-center justify-between bg-[#EEEFF1] rounded-2xl px-4 py-3`}
                    onPress={() => router.push("/(profile)/password")}
                >
                    <View style={tw`flex-row items-center`}>
                        <View
                            style={tw`w-8 h-8 items-center justify-center mr-3`}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color="#f97316"
                            />
                        </View>
                        <Text style={tw`text-sm text-slate-900 font-regular`}>
                            Modifier le mot de passe
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </Pressable>

                <Pressable
                    style={tw`flex-row items-center justify-between bg-[#EEEFF1] rounded-2xl px-4 py-3`}
                    onPress={() => router.push("/(profile)/settings")}
                >
                    <View style={tw`flex-row items-center`}>
                        <View
                            style={tw`w-8 h-8 items-center justify-center mr-3`}
                        >
                            <Ionicons name="settings-outline" size={18} color="#f97316" />
                        </View>
                        <Text style={tw`text-sm text-slate-900 font-regular`}>
                            Paramètres généraux
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </Pressable>
            </View>
        </View>
    );
}