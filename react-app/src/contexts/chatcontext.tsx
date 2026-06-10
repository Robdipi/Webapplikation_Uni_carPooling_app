import {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

export interface ChatUser {
    id: string;
    name: string;
}

interface ChatContextValue {
    user: ChatUser | null;
    setUser: Dispatch<SetStateAction<ChatUser | null>>;
}

interface ChatContextProviderProps {
    children: ReactNode;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
    const [user, setUser] = useState<ChatUser | null>(null);

    return (
        <ChatContext.Provider value={{ user, setUser }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): ChatContextValue {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error("useChatContext must be used within ChatContextProvider");
    }

    return context;
}
