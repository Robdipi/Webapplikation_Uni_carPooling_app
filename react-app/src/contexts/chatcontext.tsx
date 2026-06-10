import { createContext, useContext, useState } from "react";

const ChatContext = createContext("some Provider is missing");//Todo insert a default prop

export function ChatContextProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <ChatContext.Provider value={{ user, setUser }}>
    {children}
    </ChatContext.Provider>
);
}

export function useChatContext() {
    return useContext(ChatContext);
}