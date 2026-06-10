import {
    createContext,
    useContext,
    useEffect,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

export interface UserProfile {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    pricePerKm: string;
    course: string;
}

interface UserContextValue {
    profile: UserProfile;
    setProfile: Dispatch<SetStateAction<UserProfile>>;
}

interface UserContextProviderProps {
    children: ReactNode;
}

const initialProfile: UserProfile = {
    firstName: "Max",
    lastName: "Mustermann",
    birthDate: "2000-01-01",
    city: "Konstanz",
    pricePerKm: "0,60 €",
    course: "Allgemeine Informatik (AIN)",
};

const STORAGE_KEY = "campusride-profile";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserContextProvider({ children }: UserContextProviderProps) {
    const [profile, setProfile] = useState<UserProfile>(() => {
        const storedProfile = localStorage.getItem(STORAGE_KEY);

        if (storedProfile === null) {
            return initialProfile;
        }

        try {
            return JSON.parse(storedProfile) as UserProfile;
        } catch {
            return initialProfile;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }, [profile]);

    return (
        <UserContext.Provider value={{ profile, setProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext(): UserContextValue {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUserContext must be used within UserContextProvider");
    }

    return context;
}
