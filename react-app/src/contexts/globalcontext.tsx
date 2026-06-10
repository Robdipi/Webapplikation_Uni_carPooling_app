import { createContext, useContext, useState } from "react";

const GlobalContext = createContext("some Provider is missing");

export function GlobalContextProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <GlobalContext.Provider
            value={{
                darkMode,
                setDarkMode
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    return useContext(GlobalContext);
}