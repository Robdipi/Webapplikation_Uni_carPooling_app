import {
    createContext,
    useContext,
    useState,
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

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export function GlobalContextProvider({ children }: GlobalContextProviderProps) {
    const [darkMode, setDarkMode] = useState<boolean>(false);

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
