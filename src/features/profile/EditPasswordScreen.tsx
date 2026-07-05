import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    ScrollView,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/src/context/AuthContext";
import { updatePassword } from "@/src/services/authService";

export default function EditPasswordScreen() {
    const { user } = useAuth();
    const email = user?.email ?? "";

    const newPasswordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [oldFocused, setOldFocused] = useState(false);
    const [newFocused, setNewFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);

    const [oldHidden, setOldHidden] = useState(true);
    const [newHidden, setNewHidden] = useState(true);
    const [confirmHidden, setConfirmHidden] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        if (!email) {
            setError("Utilisateur non connecté.");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Veuillez renseigner tous les champs.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            setSubmitting(true);
            await updatePassword(email, oldPassword, newPassword);
            setSubmitting(false);
            setSuccess("Mot de passe modifié avec succès.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e: any) {
            setSubmitting(false);
            setError(e?.message || "Une erreur est survenue.");
        }
    };

    const webInputReset =
    Platform.OS === "web"
        ? ({ outlineStyle: "none", outlineWidth: 0 } as any)
        : null;

    const content = (
        <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`flex-grow px-6 pt-10 pb-10 justify-between`}
            keyboardShouldPersistTaps="handled"
        >
            <View style={tw`mt-6`}>
                <Text style={tw`mb-2 text-xs font-medium text-gray-500`}>
                    Ancien mot de passe
                </Text>
                <View
                    style={tw`mb-4 flex-row items-center rounded-2xl px-4 h-14 bg-white ${
                        oldFocused ? "border-2 border-orange-600" : "border border-gray-200"
                    }`}
                >
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={oldFocused ? "#F97316" : "#9CA3AF"}
                    />
                    <TextInput
                        style={[tw`flex-1 ml-3 text-gray-900`, webInputReset]}
                        placeholder="Entrez votre ancien mot de passe"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={oldHidden}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        onFocus={() => setOldFocused(true)}
                        onBlur={() => setOldFocused(false)}
                        returnKeyType="next"
                        onSubmitEditing={() => newPasswordRef.current?.focus()}
                    />
                    <Pressable onPress={() => setOldHidden(v => !v)} hitSlop={10}>
                        <Ionicons
                            name={oldHidden ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>

                <Text style={tw`mb-2 text-xs font-medium text-gray-500`}>
                    Nouveau mot de passe
                </Text>
                <View
                    style={tw`mb-4 flex-row items-center rounded-2xl px-4 h-14 bg-white ${
                        newFocused ? "border-2 border-orange-600" : "border border-gray-200"
                    }`}
                >
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={newFocused ? "#F97316" : "#9CA3AF"}
                    />
                    <TextInput
                        ref={newPasswordRef}
                        style={[tw`flex-1 ml-3 text-gray-900`, webInputReset]}
                        placeholder="Entrez votre nouveau mot de passe"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={newHidden}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        onFocus={() => setNewFocused(true)}
                        onBlur={() => setNewFocused(false)}
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    />
                    <Pressable onPress={() => setNewHidden(v => !v)} hitSlop={10}>
                        <Ionicons
                            name={newHidden ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>

                <Text style={tw`mb-2 text-xs font-medium text-gray-500`}>
                    Confirmer le nouveau mot de passe
                </Text>
                <View
                    style={tw`mb-2 flex-row items-center rounded-2xl px-4 h-14 bg-white ${
                        confirmFocused
                            ? "border-2 border-orange-600"
                            : "border border-gray-200"
                    }`}
                >
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={confirmFocused ? "#F97316" : "#9CA3AF"}
                    />
                    <TextInput
                        ref={confirmPasswordRef}
                        style={[tw`flex-1 ml-3 text-gray-900`, webInputReset]}
                        placeholder="Confirmez le nouveau mot de passe"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={confirmHidden}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setConfirmFocused(true)}
                        onBlur={() => setConfirmFocused(false)}
                        returnKeyType="done"
                        onSubmitEditing={handleSave}
                    />
                    <Pressable onPress={() => setConfirmHidden(v => !v)} hitSlop={10}>
                        <Ionicons
                            name={confirmHidden ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>

                {error && (
                    <Text style={tw`mt-3 text-red-500`}>{error}</Text>
                )}

                {success && (
                    <Text style={tw`mt-3 text-green-600`}>{success}</Text>
                )}
            </View>

            <Pressable
                style={tw`mt-auto h-14 rounded-2xl bg-orange-600 items-center justify-center ${
                    submitting ? "opacity-50" : "opacity-100"
                }`}
                onPress={handleSave}
                disabled={submitting}
            >
                <Text style={tw`text-white font-semibold`}>
                    {submitting ? "En cours..." : "Enregistrer les modifications"}
                </Text>
            </Pressable>
        </ScrollView>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {Platform.OS === "web" ? (
                content
            ) : (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    {content}
                </TouchableWithoutFeedback>
            )}
        </KeyboardAvoidingView>
    );
}