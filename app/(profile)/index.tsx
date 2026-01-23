import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import ProfileScreen from "@/src/features/profile/ProfileScreen";

export default function ProfileIndex() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={tw`flex-1 items-center justify-center bg-white`}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={tw`flex-1 bg-white px-6 pt-10`}>
                <Text style={tw`text-3xl font-bold mb-2`}>Profil</Text>
                <Text style={tw`text-gray-600 mb-8`}>
                    Vous n&apos;êtes pas connecté. Connectez-vous ou créez un compte pour accéder à votre profil.
                </Text>

                <Pressable
                    style={tw`h-12 rounded-2xl bg-orange-600 items-center justify-center mb-3`}
                    onPress={() => router.push("/(auth)/login")}
                >
                    <Text style={tw`text-white font-semibold`}>Se connecter</Text>
                </Pressable>

                <Pressable
                    style={tw`h-12 rounded-2xl border border-orange-600 items-center justify-center`}
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Text style={tw`text-orange-600 font-semibold`}>Créer un compte</Text>
                </Pressable>
            </View>
        );
    }

    return <ProfileScreen />;
}