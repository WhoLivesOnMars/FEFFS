import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "@/src/context/AuthContext";
import { getUserProfile, saveUserProfile, UserProfile } from "@/src/services/profileService";
import { router } from "expo-router";

export default function EditProfileScreen() {
    const { user, updateEmail } = useAuth();
    const email = user?.email ?? "";

    const [fullName, setFullName] = useState("");
    const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
    const [emailField, setEmailField] = useState(email);

    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const nameInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const load = async () => {
            if (!email) {
                setLoading(false);
                return;
            }
            const data: UserProfile | null = await getUserProfile(email);
            setFullName(data?.fullName ?? "");
            setAvatarUri(data?.avatarUri);
            setEmailField(email);
            setLoading(false);
        };

        load();
    }, [email]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission refusée pour accéder aux photos");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (e) {
            console.log("Erreur lors du choix de l'image :", e);
        }
    };

    const handleSave = async () => {
        if (!email) return;

        const trimmedName = fullName.trim();
        const trimmedEmail = emailField.trim();

        if (!trimmedEmail) {
            return;
        }

        try {
            setSaving(true);

            let finalEmail = email;

            if (trimmedEmail.toLowerCase() !== email.toLowerCase()) {
                await updateEmail(trimmedEmail);
                finalEmail = trimmedEmail;
            }

            await saveUserProfile(finalEmail, {
                fullName: trimmedName,
                avatarUri,
            });
            setSaving(false);
            router.back();
        } catch (e) {
            console.log("Erreur lors de l'enregistrement du profil :", e);
            setSaving(false);
        }
    };

    if (!email) {
        return (
            <View style={tw`flex-1 items-center justify-center bg-white px-6`}>
                <Text style={tw`text-center text-slate-900 mb-4`}>
                    Vous devez être connecté pour modifier votre profil.
                </Text>
                <Pressable
                    style={tw`h-12 px-5 rounded-2xl bg-orange-600 items-center justify-center`}
                    onPress={() => router.replace("/(auth)/login")}
                >
                    <Text style={tw`text-white font-semibold`}>Se connecter</Text>
                </Pressable>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={tw`flex-1 items-center justify-center bg-white`}>
                <Text>Chargement du profil...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={tw`flex-1`}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    style={tw`flex-1`}
                    contentContainerStyle={tw`flex-grow px-6 pt-10 pb-10`}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={tw`items-center mb-8`}>
                        <Pressable
                            style={tw`w-28 h-28 rounded-full bg-orange-200 items-center justify-center`}
                            onPress={pickImage}
                        >
                            {avatarUri ? (
                                <Image
                                    source={{ uri: avatarUri }}
                                    style={tw`w-28 h-28 rounded-full`}
                                />
                            ) : (
                                <Ionicons name="person-outline" size={40} color="#f97316" />
                            )}

                            <View
                                style={tw`absolute bottom-1 right-1 w-7 h-7 rounded-full bg-orange-500 items-center justify-center`}
                            >
                                <Ionicons name="camera-outline" size={16} color="#ffffff" />
                            </View>
                        </Pressable>
                    </View>

                    <View style={tw`mb-4`}>
                        <Text style={tw`mb-1 text-xs text-gray-500`}>Nom complet</Text>
                        <View
                            style={tw`rounded-2xl px-4 h-12 bg-white ${
                                nameFocused
                                    ? "border-2 border-orange-500"
                                    : "border border-gray-200"
                            }`}
                        >
                            <TextInput
                                ref={nameInputRef}
                                style={tw`flex-1 text-gray-900`}
                                placeholder="Nom complet"
                                placeholderTextColor="#9CA3AF"
                                value={fullName}
                                onChangeText={setFullName}
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                                returnKeyType="done"
                            />
                        </View>
                    </View>

                    <View style={tw`mb-8`}>
                        <Text style={tw`mb-1 text-xs text-gray-500`}>E-mail</Text>
                        <View
                            style={tw`rounded-2xl px-4 h-12 bg-white ${
                                emailFocused ? "border-2 border-orange-500" : "border border-gray-200"
                            } justify-center`}
                        >
                            <TextInput
                                style={tw`text-gray-900`}
                                placeholder="E-mail"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={emailField}
                                onChangeText={setEmailField}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                returnKeyType="done"
                            />
                        </View>
                    </View>

                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        style={tw`mt-auto h-14 rounded-2xl bg-orange-600 items-center justify-center ${
                            saving ? "opacity-70" : "opacity-100"
                        }`}
                    >
                        <Text style={tw`text-white font-semibold`}>
                            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}