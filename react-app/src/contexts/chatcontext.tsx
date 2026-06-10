import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export interface ChatContact {
    id: string;
    name: string;
    avatarUrl: string;
}

export type MessageSender = "me" | "contact";

export type ChatMessageType = "text" | "image";

export interface ChatMessage {
    id: string;
    contactId: string;
    sender: MessageSender;
    type: ChatMessageType;
    content: string;
    sentAt: string;
}

interface ChatContextValue {
    contacts: ChatContact[];
    selectedContactId: string;
    selectedContact: ChatContact;
    selectedMessages: ChatMessage[];
    selectContact: (contactId: string) => void;
    sendMessage: (content: string) => void;
    clearChat: (contactId: string) => void;
    getLastMessage: (contactId: string) => ChatMessage | undefined;
}

interface ChatContextProviderProps {
    children: ReactNode;
}

const CHAT_MESSAGES_STORAGE_KEY = "campusride-chat-messages";
const CHAT_SELECTED_CONTACT_STORAGE_KEY = "campusride-selected-contact";

const initialContacts: ChatContact[] = [
    {
        id: "lisa",
        name: "Lisa Müller",
        avatarUrl: "https://picsum.photos/seed/lisa/120/120",
    },
    {
        id: "max",
        name: "Max Weber",
        avatarUrl: "https://picsum.photos/seed/max/120/120",
    },
    {
        id: "sarah",
        name: "Sarah Fischer",
        avatarUrl: "https://picsum.photos/seed/sarah/120/120",
    },
    {
        id: "jonas",
        name: "Jonas Klein",
        avatarUrl: "https://picsum.photos/seed/jonas/120/120",
    },
];

const initialMessages: ChatMessage[] = [
    {
        id: "msg-1",
        contactId: "lisa",
        sender: "contact",
        type: "text",
        content: "Hey, ist der Platz nach Konstanz noch frei?",
        sentAt: "09:12",
    },
    {
        id: "msg-2",
        contactId: "lisa",
        sender: "me",
        type: "text",
        content: "Ja, ein Platz ist noch frei.",
        sentAt: "09:13",
    },
    {
        id: "msg-3",
        contactId: "max",
        sender: "contact",
        type: "text",
        content: "Kannst du mich an der HTWG einsammeln?",
        sentAt: "Gestern",
    },
];

function readMessagesFromLocalStorage(): ChatMessage[] {
    try {
        const storedMessages = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);

        if (storedMessages === null) {
            return initialMessages;
        }

        return JSON.parse(storedMessages) as ChatMessage[];
    } catch {
        return initialMessages;
    }
}

function readSelectedContactIdFromLocalStorage(): string {
    const storedContactId = localStorage.getItem(CHAT_SELECTED_CONTACT_STORAGE_KEY);
    const contactExists = initialContacts.some(
        (contact) => contact.id === storedContactId,
    );

    if (storedContactId !== null && contactExists) {
        return storedContactId;
    }

    return initialContacts[0].id;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(
        readMessagesFromLocalStorage,
    );
    const [selectedContactId, setSelectedContactId] = useState<string>(
        readSelectedContactIdFromLocalStorage,
    );

    useEffect(() => {
        localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem(CHAT_SELECTED_CONTACT_STORAGE_KEY, selectedContactId);
    }, [selectedContactId]);

    const selectedContact =
        initialContacts.find((contact) => contact.id === selectedContactId) ??
        initialContacts[0];

    const selectedMessages = useMemo(
        () =>
            messages.filter(
                (message) => message.contactId === selectedContact.id,
            ),
        [messages, selectedContact.id],
    );

    const selectContact = (contactId: string) => {
        setSelectedContactId(contactId);
    };

    const sendMessage = (content: string) => {
        const trimmedContent = content.trim();

        if (trimmedContent === "") {
            return;
        }

        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            contactId: selectedContact.id,
            sender: "me",
            type: "text",
            content: trimmedContent,
            sentAt: new Date().toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((previousMessages) => [...previousMessages, newMessage]);
    };

    const clearChat = (contactId: string) => {
        setMessages((previousMessages) =>
            previousMessages.filter((message) => message.contactId !== contactId),
        );
    };

    const getLastMessage = (contactId: string): ChatMessage | undefined => {
        const contactMessages = messages.filter(
            (message) => message.contactId === contactId,
        );

        return contactMessages.at(-1);
    };

    const contextValue: ChatContextValue = {
        contacts: initialContacts,
        selectedContactId,
        selectedContact,
        selectedMessages,
        selectContact,
        sendMessage,
        clearChat,
        getLastMessage,
    };

    return (
        <ChatContext.Provider value={contextValue}>
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
