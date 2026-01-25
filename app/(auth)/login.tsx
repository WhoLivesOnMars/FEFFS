import { SafeAreaView } from "react-native";
import { router } from "expo-router";
import tw from "twrnc";
import LoginScreen from "../../src/features/auth/LoginScreen";

export default function LoginPage() {
    return (
        <SafeAreaView style={tw`flex-1 bg-[#fafafa]`}>
            <LoginScreen
                onLoggedIn={() => router.replace("/(profile)")}
                onGoToRegister={() => router.push("/(auth)/register")}
                onForgotPassword={() => {}}
            />
        </SafeAreaView>
    );
}