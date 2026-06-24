import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
    ApiUser,
    getCurrentUserRequest,
    loginUserRequest,
    registerUserRequest,
} from "../api/authApi";

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
    authToken: string | null;
    isLoggedIn: boolean;
    isAuthLoading: boolean;
    profile: UserProfile;
    registerUser: (input: RegisterUserInput) => Promise<AuthResult>;
    loginUser: (input: LoginUserInput) => Promise<AuthResult>;
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

const AUTH_TOKEN_STORAGE_KEY = "campusRideAuthToken";

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

function toRegisteredUser(apiUser: ApiUser): RegisteredUser {
    return {
        id: apiUser.id,
        email: apiUser.email,
        username: apiUser.username,
        profile: {
            firstName: apiUser.profile.firstName,
            lastName: apiUser.profile.lastName,
            birthDate: apiUser.profile.birthDate,
            city: "Konstanz",
            pricePerKm: "0,60 €",
            course: apiUser.profile.course,
        },
    };
}

function validateRegisterInput(input: RegisterUserInput): string | null {
    if (
        input.email.trim() === "" ||
        input.username.trim() === "" ||
        input.password.trim() === "" ||
        input.firstName.trim() === "" ||
        input.lastName.trim() === "" ||
        input.course.trim() === "" ||
        input.birthDate.trim() === ""
    ) {
        return "Bitte fülle alle Pflichtfelder aus.";
    }

    return null;
}

function validateLoginInput(input: LoginUserInput): string | null {
    if (input.identifier.trim() === "" || input.password.trim() === "") {
        return "Bitte gib Benutzername/E-Mail und Passwort ein.";
    }

    return null;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
    const [users, setUsers] = useState<RegisteredUser[]>([]);
    const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(() =>
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
    );
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    useEffect(() => {
        async function restoreCurrentUser() {
            if (authToken === null) {
                setIsAuthLoading(false);
                return;
            }

            try {
                const apiUser = await getCurrentUserRequest(authToken);
                const restoredUser = toRegisteredUser(apiUser);

                setCurrentUser(restoredUser);
                setUsers([restoredUser]);
            } catch {
                localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
                setAuthToken(null);
                setCurrentUser(null);
                setUsers([]);
            } finally {
                setIsAuthLoading(false);
            }
        }

        restoreCurrentUser();
    }, [authToken]);

    const registerUser = async (input: RegisterUserInput): Promise<AuthResult> => {
        const validationError = validateRegisterInput(input);

        if (validationError !== null) {
            return { success: false, error: validationError };
        }

        try {
            const response = await registerUserRequest({
                email: input.email.trim().toLowerCase(),
                username: input.username.trim(),
                password: input.password,
                firstName: input.firstName.trim(),
                lastName: input.lastName.trim(),
                birthDate: input.birthDate.trim(),
                course: input.course.trim(),
            });

            const registeredUser = toRegisteredUser(response.user);

            localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
            setCurrentUser(registeredUser);
            setAuthToken(response.token);
            setUsers([registeredUser]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Registrierung fehlgeschlagen.",
            };
        }
    };

    const loginUser = async (input: LoginUserInput): Promise<AuthResult> => {
        const validationError = validateLoginInput(input);

        if (validationError !== null) {
            return { success: false, error: validationError };
        }

        try {
            const response = await loginUserRequest({
                identifier: input.identifier.trim(),
                password: input.password,
            });

            const loggedInUser = toRegisteredUser(response.user);

            localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
            setCurrentUser(loggedInUser);
            setAuthToken(response.token);
            setUsers([loggedInUser]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Anmeldung fehlgeschlagen.",
            };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setCurrentUser(null);
        setAuthToken(null);
        setUsers([]);
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
        authToken,
        isLoggedIn: currentUser !== null,
        isAuthLoading,
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