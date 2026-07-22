import {
    createContext,
    useContext,
    useState,
    useEffect,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

interface GlobalContextValue {
    darkMode: boolean;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
}

interface GlobalContextProviderProps {
    children: ReactNode;
}

const DARK_MODE_KEY = "campusRideDarkMode";

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export function GlobalContextProvider({ children }: GlobalContextProviderProps) {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem(DARK_MODE_KEY) === "true";
    });

    useEffect(() => {
        localStorage.setItem(DARK_MODE_KEY, String(darkMode));
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    return (
        <GlobalContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext(): GlobalContextValue {
    const context = useContext(GlobalContext);

    if (context === undefined) {
        throw new Error("useGlobalContext must be used within GlobalContextProvider");
    }

    return context;
}
