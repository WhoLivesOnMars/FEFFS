import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";
import { router } from "expo-router";

type ThemeOptionKey = "light" | "dark" | "system";

type ThemeOption = {
    key: ThemeOptionKey;
    label: string;
};

const OPTIONS: ThemeOption[] = [
    { key: "light", label: "Clair" },
    { key: "dark", label: "Sombre" },
    { key: "system", label: "Par défaut" },
];

export default function ThemeScreen() {
    const { theme, setTheme } = useTheme();
    const [selected, setSelected] = useState<ThemeOptionKey>(theme);

    useEffect(() => {
        setSelected(theme);
    }, [theme]);

    const handleSelect = (key: ThemeOptionKey) => {
        setSelected(key);
    };

    const handleSave = async () => {
        await setTheme(selected);
        router.back();
    };

    return (
        <View style={tw`flex-1`}>
            <ScrollView
                contentContainerStyle={tw`flex-grow px-4 pt-6 pb-10 justify-between`}
            >
                <View>
                    {OPTIONS.map((opt, index) => {
                        const isSelected = selected === opt.key;

                        return (
                            <Pressable
                                key={opt.key}
                                onPress={() => handleSelect(opt.key)}
                                style={[
                                    tw`flex-row items-center justify-between bg-white rounded-2xl px-4 py-4`,
                                    index < OPTIONS.length - 1 && tw`mb-3`,
                                    isSelected && tw`border-2 border-orange-500`,
                                ]}
                            >
                                <Text style={tw`text-base text-gray-900`}>
                                    {opt.label}
                                </Text>

                                {isSelected && (
                                    <View
                                        style={tw`w-6 h-6 rounded-full bg-orange-500 items-center justify-center`}
                                    >
                                        <Ionicons
                                            name="checkmark"
                                            size={14}
                                            color="#fff"
                                        />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                <Pressable
                    style={tw`mt-8 h-14 rounded-2xl bg-orange-600 items-center justify-center`}
                    onPress={handleSave}
                >
                    <Text style={tw`text-white font-semibold text-base`}>
                        Enregistrer les modifications
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}