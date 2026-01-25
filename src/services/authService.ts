import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "APP_USERS";
const CURRENT_USER_KEY = "APP_CURRENT_USER";

export type StoredUser = {
    email: string;
    password: string;
};

type CurrentUser = {
    email: string;
};

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

async function getUsers(): Promise<StoredUser[]> {
    const json = await AsyncStorage.getItem(USERS_KEY);
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
    } catch {
        return [];
    }
}

async function setUsers(users: StoredUser[]): Promise<void> {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(email: string, password: string): Promise<StoredUser> {
    const users = await getUsers();

    const emailNorm = normalizeEmail(email);
    if (!emailNorm || !password) {
        throw new Error("Veuillez renseigner l’e-mail et le mot de passe.");
    }

    const existing = users.find((u) => normalizeEmail(u.email) === emailNorm);
    if (existing) {
        throw new Error("Un utilisateur avec cet e-mail existe déjà.");
    }

    const newUser: StoredUser = { email: emailNorm, password };
    await setUsers([...users, newUser]);

    // В currentUser храним только email (без пароля)
    const current: CurrentUser = { email: emailNorm };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

    return newUser;
}

export async function loginUser(email: string, password: string): Promise<StoredUser> {
    const users = await getUsers();

    const emailNorm = normalizeEmail(email);
    if (!emailNorm || !password) {
        throw new Error("Veuillez renseigner l’e-mail et le mot de passe.");
    }

    const user = users.find(
        (u) => normalizeEmail(u.email) === emailNorm && u.password === password
    );

    if (!user) {
        throw new Error("E-mail ou mot de passe incorrect.");
    }

    const current: CurrentUser = { email: emailNorm };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

    return user;
}

export async function updateUserEmail(oldEmail: string, newEmail: string): Promise<StoredUser> {
    const users = await getUsers();

    const oldNorm = normalizeEmail(oldEmail);
    const newNorm = normalizeEmail(newEmail);

    if (!newNorm) {
        throw new Error("Veuillez renseigner l’e-mail.");
    }

    const existing = users.find(u => normalizeEmail(u.email) === newNorm);
    if (existing) {
        throw new Error("Un utilisateur avec cet e-mail existe déjà.");
    }

    const index = users.findIndex(u => normalizeEmail(u.email) === oldNorm);
    if (index === -1) {
        throw new Error("Utilisateur introuvable.");
    }

    const updatedUser: StoredUser = { ...users[index], email: newNorm };
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;

    await setUsers(updatedUsers);

    const current: CurrentUser = { email: newNorm };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

    return updatedUser;
}

export async function updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
): Promise<void> {
    const users = await getUsers();
    const emailNorm = normalizeEmail(email);

    if (!emailNorm || !oldPassword || !newPassword) {
        throw new Error("Veuillez renseigner tous les champs.");
    }

    const idx = users.findIndex(
        (u) => normalizeEmail(u.email) === emailNorm
    );

    if (idx === -1) {
        throw new Error("Utilisateur introuvable.");
    }

    if (users[idx].password !== oldPassword) {
        throw new Error("Ancien mot de passe incorrect.");
    }

    if (newPassword.length < 8) {
        throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
    }

    users[idx] = { ...users[idx], password: newPassword };
    await setUsers(users);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!json) return null;
    try {
        const parsed = JSON.parse(json) as CurrentUser;
        return parsed?.email ? parsed : null;
    } catch {
        return null;
    }
}

export async function logoutUser(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function clearAllUsers(): Promise<void> {
    await AsyncStorage.removeItem(USERS_KEY);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
}