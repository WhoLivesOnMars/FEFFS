import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/(auth)/login");
        } catch (e) {
            console.log("Erreur de déconnexion :", e);
        }
    };

    return (
        <View style={tw`flex-1 bg-white px-6 pt-10`}>
            <Text style={tw`text-3xl font-bold mb-2`}>Profil</Text>

            <Text style={tw`text-gray-600 mb-8`}>
                Connecté en tant que{" "}
                <Text style={tw`font-semibold`}>
                    {user?.email ?? "utilisateur inconnu"}
                </Text>
            </Text>

            <Pressable
                onPress={handleLogout}
                style={tw`mt-4 h-12 rounded-2xl bg-orange-600 items-center justify-center`}
            >
                <Text style={tw`text-white font-semibold`}>Se déconnecter</Text>
            </Pressable>
        </View>
    );
}