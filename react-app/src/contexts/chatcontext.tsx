import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    getChatContactsRequest,
    sendMessageRequest,
    clearChatRequest,
} from "../api/chatApi";

export interface ChatContactUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

export interface ChatContact {
    id: string;
    name: string;
    userId: string;
    user: ChatContactUser;
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

const CHAT_SELECTED_CONTACT_STORAGE_KEY = "campusride-selected-contact";

const fallbackUser: ChatContactUser = {
    id: "fallback",
    firstName: "Unbekannt",
    lastName: "",
    avatarUrl: "",
};

const fallbackContacts: ChatContact[] = [
    {
        id: "lisa",
        name: "Lisa Müller",
        userId: "fallback",
        user: fallbackUser,
    },
    {
        id: "max",
        name: "Max Weber",
        userId: "fallback",
        user: fallbackUser,
    },
    {
        id: "sarah",
        name: "Sarah Fischer",
        userId: "fallback",
        user: fallbackUser,
    },
    {
        id: "jonas",
        name: "Jonas Klein",
        userId: "fallback",
        user: fallbackUser,
    },
];

const fallbackMessages: ChatMessage[] = [
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

function readSelectedContactIdFromLocalStorage(
    contacts: ChatContact[],
): string {
    const storedContactId = localStorage.getItem(
        CHAT_SELECTED_CONTACT_STORAGE_KEY,
    );
    const contactExists = contacts.some(
        (contact) => contact.id === storedContactId,
    );
    if (storedContactId !== null && contactExists) {
        return storedContactId;
    }
    return contacts.length > 0 ? contacts[0].id : "";
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string>("");

    useEffect(() => {
        async function loadChat() {
            try {
                const apiContacts = await getChatContactsRequest();

                if (apiContacts.length > 0) {
                    setContacts(apiContacts);
                    setSelectedContactId(
                        readSelectedContactIdFromLocalStorage(apiContacts),
                    );

                    const allMessages: ChatMessage[] = [];
                    for (const contact of apiContacts) {
                        if (contact.messages) {
                            allMessages.push(
                                ...contact.messages.map((m) => ({
                                    id: m.id,
                                    contactId: m.contactId,
                                    sender: m.sender as MessageSender,
                                    type: m.type as ChatMessageType,
                                    content: m.content,
                                    sentAt: m.sentAt,
                                })),
                            );
                        }
                    }
                    setMessages(allMessages);
                } else {
                    setContacts(fallbackContacts);
                    setSelectedContactId(fallbackContacts[0].id);
                    setMessages(fallbackMessages);
                }
            } catch {
                setContacts(fallbackContacts);
                setSelectedContactId(fallbackContacts[0].id);
                setMessages(fallbackMessages);
            }
        }

        loadChat();
    }, []);

    useEffect(() => {
        localStorage.setItem(
            CHAT_SELECTED_CONTACT_STORAGE_KEY,
            selectedContactId,
        );
    }, [selectedContactId]);

    const selectedContact = useMemo(() => {
        return (
            contacts.find((contact) => contact.id === selectedContactId) ??
            contacts[0] ?? { id: "", name: "", userId: "", user: fallbackUser }
        );
    }, [contacts, selectedContactId]);

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

    const sendMessage = async (content: string) => {
        const trimmedContent = content.trim();

        if (trimmedContent === "") {
            return;
        }

        const sentAt = new Date().toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        try {
            const created = await sendMessageRequest(
                selectedContact.id,
                "me",
                "text",
                trimmedContent,
                sentAt,
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    ...created,
                    sender: created.sender as MessageSender,
                    type: created.type as ChatMessageType,
                },
            ]);
        } catch {
            const fallbackMessage: ChatMessage = {
                id: crypto.randomUUID(),
                contactId: selectedContact.id,
                sender: "me",
                type: "text",
                content: trimmedContent,
                sentAt,
            };
            setMessages((previousMessages) => [
                ...previousMessages,
                fallbackMessage,
            ]);
        }
    };

    const clearChat = async (contactId: string) => {
        try {
            await clearChatRequest(contactId);
        } catch {
            // Continue even if API fails
        }

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
        contacts,
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
