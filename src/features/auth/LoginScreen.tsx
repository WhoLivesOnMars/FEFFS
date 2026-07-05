import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

type Props = {
    onLoggedIn?: () => void;
    onGoToRegister?: () => void;
    onForgotPassword?: () => void;
};

export default function LoginScreen({ onLoggedIn, onGoToRegister, onForgotPassword }: Props) {
    const { login } = useAuth();

    const passwordRef = useRef<TextInput>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setError(null);

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            setError("Veuillez renseigner l’e-mail et le mot de passe.");
            return;
        }

        try {
            setSubmitting(true);
            await login(trimmedEmail, password);
            setSubmitting(false);
            onLoggedIn?.();
        } catch (e: any) {
            setSubmitting(false);
            setError(e?.message || "E-mail ou mot de passe incorrect.");
        }
    };

    const content = (
        <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`flex-grow px-6 pt-10 pb-10`}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={tw`text-4xl font-bold text-slate-900 leading-[46px]`}>
                Connectez-vous à votre compte
            </Text>

            <View style={tw`mt-4 flex-row flex-wrap`}>
                <Text style={tw`text-gray-600`}>Vous n’avez pas de compte ? </Text>
                <Text
                    style={tw`text-orange-600 font-semibold`}
                    onPress={onGoToRegister}
                >
                    S’inscrire
                </Text>
            </View>

            <View style={tw`mt-16`}>
                <View
                    style={tw`mb-4 flex-row items-center rounded-2xl px-4 h-14 bg-white ${
                        emailFocused
                            ? "border-2 border-orange-600"
                            : "border border-gray-200"
                    }`}
                >
                    <Ionicons
                        name="mail-outline"
                        size={20}
                        color={emailFocused ? "#F97316" : "#9CA3AF"}
                    />
                    <TextInput
                        style={tw`flex-1 ml-3 text-gray-900`}
                        placeholder="Entrez votre adresse e-mail"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                </View>

                <View
                    style={tw`mb-2 flex-row items-center rounded-2xl px-4 h-14 bg-white ${
                        passwordFocused
                            ? "border-2 border-orange-600"
                            : "border border-gray-200"
                    }`}
                >
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={passwordFocused ? "#F97316" : "#9CA3AF"}
                    />
                    <TextInput
                        ref={passwordRef}
                        style={tw`flex-1 ml-3 text-gray-900`}
                        placeholder="Entrez votre mot de passe"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={passwordHidden}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />
                    <Pressable
                        onPress={() => setPasswordHidden((v) => !v)}
                        hitSlop={10}
                    >
                        <Ionicons
                            name={passwordHidden ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>

                <View style={tw`flex-row items-center justify-between mt-3`}>
                    <Pressable
                        style={tw`flex-row items-center`}
                        onPress={() => setRememberMe((v) => !v)}
                        hitSlop={10}
                    >
                        <View
                            style={tw`w-5 h-5 rounded border ${
                                rememberMe ? "border-orange-600" : "border-gray-300"
                            } items-center justify-center mr-3`}
                        >
                            {rememberMe && (
                                <Ionicons name="checkmark" size={14} color="#F97316" />
                            )}
                        </View>
                        <Text style={tw`text-gray-700`}>Se souvenir de moi</Text>
                    </Pressable>

                    <Text
                        style={tw`text-orange-600 font-semibold`}
                        onPress={onForgotPassword}
                    >
                        Mot de passe oublié ?
                    </Text>
                </View>

                {error ? <Text style={tw`mt-3 text-red-500`}>{error}</Text> : null}

                <Pressable
                    style={tw`mt-34 h-14 rounded-2xl bg-orange-600 items-center justify-center ${
                        submitting ? "opacity-50" : "opacity-100"
                    }`}
                    onPress={handleLogin}
                    disabled={submitting}
                >
                    <Text style={tw`text-white font-semibold text-base`}>
                        {submitting ? "En cours..." : "Se connecter"}
                    </Text>
                </Pressable>
            </View>
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