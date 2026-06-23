import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface UserProfile {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    pricePerKm: string;
    course: string;
}

export interface RegisteredUser {
    id: string;
    email: string;
    username: string;
    password: string;
    profile: UserProfile;
}

export interface RegisterUserInput {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    course: string;
}

export interface LoginUserInput {
    identifier: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    error?: string;
}

interface UserContextValue {
    users: RegisteredUser[];
    currentUser: RegisteredUser | null;
    isLoggedIn: boolean;
    profile: UserProfile;
    registerUser: (input: RegisterUserInput) => AuthResult;
    loginUser: (input: LoginUserInput) => AuthResult;
    logoutUser: () => void;
    setProfile: (profile: UserProfile) => void;
}

const defaultProfile: UserProfile = {
    firstName: "Max",
    lastName: "Mustermann",
    birthDate: "2000-01-01",
    city: "Konstanz",
    pricePerKm: "0,60 €",
    course: "Allgemeine Informatik (AIN)",
};

const USERS_STORAGE_KEY = "campusRideUsers";

function readFromLocalStorage<T>(key: string, fallback: T): T {
    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return fallback;
        }

        return JSON.parse(storedValue) as T;
    } catch {
        return fallback;
    }
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
    const [users, setUsers] = useState<RegisteredUser[]>(() =>
        readFromLocalStorage<RegisteredUser[]>(USERS_STORAGE_KEY, []),
    );

    const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

    useEffect(() => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }, [users]);

    const registerUser = (input: RegisterUserInput): AuthResult => {
        const email = input.email.trim().toLowerCase();
        const username = input.username.trim();
        const password = input.password;

        if (
            email === "" ||
            username === "" ||
            password === "" ||
            input.firstName.trim() === "" ||
            input.lastName.trim() === "" ||
            input.course.trim() === "" ||
            input.birthDate === ""
        ) {
            return { success: false, error: "Bitte fülle alle Pflichtfelder aus." };
        }

        const userAlreadyExists = users.some(
            (user) =>
                user.email === email ||
                user.username.toLowerCase() === username.toLowerCase(),
        );

        if (userAlreadyExists) {
            return {
                success: false,
                error: "E-Mail oder Benutzername ist bereits registriert.",
            };
        }

        const newUser: RegisteredUser = {
            id: crypto.randomUUID(),
            email,
            username,
            password,
            profile: {
                firstName: input.firstName.trim(),
                lastName: input.lastName.trim(),
                birthDate: input.birthDate,
                city: "Konstanz",
                pricePerKm: "0,60 €",
                course: input.course.trim(),
            },
        };

        setUsers((previousUsers) => [...previousUsers, newUser]);
        setCurrentUser(newUser);

        return { success: true };
    };

    const loginUser = (input: LoginUserInput): AuthResult => {
        const identifier = input.identifier.trim().toLowerCase();
        const password = input.password;

        if (identifier === "" || password === "") {
            return { success: false, error: "Bitte gib Benutzername/E-Mail und Passwort ein." };
        }

        const foundUser = users.find(
            (user) =>
                user.email === identifier ||
                user.username.toLowerCase() === identifier,
        );

        if (foundUser === undefined || foundUser.password !== password) {
            return {
                success: false,
                error: "Benutzername/E-Mail oder Passwort ist falsch.",
            };
        }

        setCurrentUser(foundUser);
        return { success: true };
    };

    const logoutUser = () => {
        setCurrentUser(null);
    };

    const setProfile = (profile: UserProfile) => {
        if (currentUser === null) {
            return;
        }

        const updatedUser: RegisteredUser = {
            ...currentUser,
            profile,
        };

        setCurrentUser(updatedUser);
        setUsers((previousUsers) =>
            previousUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user,
            ),
        );
    };

    const contextValue: UserContextValue = {
        users,
        currentUser,
        isLoggedIn: currentUser !== null,
        profile: currentUser?.profile ?? defaultProfile,
        registerUser,
        loginUser,
        logoutUser,
        setProfile,
    };

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
}

export function useUserContext(): UserContextValue {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUserContext must be used within UserContextProvider");
    }

    return context;
}