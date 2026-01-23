import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import tw from "twrnc";
import RegisterScreen from "../../src/features/auth/RegisterScreen";

export default function RegisterPage() {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <RegisterScreen
                onRegistered={() => router.replace("/(profile)")}
                onGoToLogin={() => router.push("/(auth)/login")}
            />
        </SafeAreaView>
    );
}