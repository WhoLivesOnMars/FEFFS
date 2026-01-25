import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GeneralSettingsScreen() {
    const currentThemeLabel = "Par défaut";

    const goToTerms = () => {
        router.push("/(profile)/terms");
    };

    const goToPrivacy = () => {
        router.push("/(profile)/privacy");
    };

    return (
        <View style={tw`flex-1 px-4 pt-6`}>
            <View>
                <Pressable
                    style={tw`mb-3 flex-row items-center justify-between bg-white rounded-2xl px-4 py-4`}
                >
                    <View>
                        <Text style={tw`mt-1 text-base text-gray-900`}>Thème</Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`mr-2 text-sm text-orange-500`}>
                            {currentThemeLabel}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={goToTerms}
                    style={tw`mb-3 flex-row items-center justify-between bg-white rounded-2xl px-4 py-4`}
                >
                    <Text style={tw`text-base text-gray-900`}>
                        Conditions d’utilisation
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable
                    onPress={goToPrivacy}
                    style={tw`flex-row items-center justify-between bg-white rounded-2xl px-4 py-4`}
                >
                    <Text style={tw`text-base text-gray-900`}>
                        Politique de confidentialité
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
            </View>
        </View>
    );
}