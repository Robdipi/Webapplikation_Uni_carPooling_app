import { createContext, useContext, useState } from "react";

const UserContext = createContext("some Provider is missing");//Todo insert a default prop

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
    {children}
    </UserContext.Provider>
);
}

export function useUserContext() {
    return useContext(UserContext);
}