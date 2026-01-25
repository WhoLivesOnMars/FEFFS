import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY_PREFIX = "APP_PROFILE_";

export type UserProfile = {
    fullName?: string;
    avatarUri?: string;
};

function keyForEmail(email: string) {
    return PROFILE_KEY_PREFIX + email.trim().toLowerCase();
}

export async function getUserProfile(email: string): Promise<UserProfile | null> {
    try {
        const json = await AsyncStorage.getItem(keyForEmail(email));
        if (!json) return null;
        const parsed = JSON.parse(json);
        return parsed && typeof parsed === "object" ? parsed as UserProfile : null;
    } catch {
        return null;
    }
}

export async function saveUserProfile(
    email: string,
    profile: UserProfile
): Promise<void> {
    const json = JSON.stringify(profile);
    await AsyncStorage.setItem(keyForEmail(email), json);
}