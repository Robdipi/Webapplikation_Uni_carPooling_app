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
    createChatContactRequest,
    deleteContactRequest,
} from "../api/chatApi";
import { useUserContext } from "./usercontext";

export interface ChatContactUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

export interface ChatContact {
    id: string;
    userId: string;
    user: ChatContactUser;
}

export type ChatMessageType = "text" | "image";

export interface ChatMessage {
    id: string;
    contactId: string;
    senderId: string;
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
    deleteContact: (contactId: string) => void;
    addContact: (userId: string) => Promise<ChatContact | null>;
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

const fallbackContacts: ChatContact[] = [];

const fallbackMessages: ChatMessage[] = [];

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
    const { currentUser, authToken } = useUserContext();
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string>("");

    useEffect(() => {
        async function loadChat() {
            try {
                const apiContacts = await getChatContactsRequest(authToken ?? "");

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
                                    senderId: m.senderId,
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
    }, [authToken]);

    useEffect(() => {
        localStorage.setItem(
            CHAT_SELECTED_CONTACT_STORAGE_KEY,
            selectedContactId,
        );
    }, [selectedContactId]);

    const selectedContact = useMemo(() => {
        return (
            contacts.find((contact) => contact.id === selectedContactId) ??
            contacts[0] ?? { id: "", userId: "", user: fallbackUser }
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

        if (trimmedContent === "" || currentUser === null) {
            return;
        }

        const sentAt = new Date().toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        try {
            const created = await sendMessageRequest(
                selectedContact.id,
                currentUser.id,
                "text",
                trimmedContent,
                sentAt,
                authToken ?? "",
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    ...created,
                    type: created.type as ChatMessageType,
                },
            ]);
        } catch {
            const fallbackMessage: ChatMessage = {
                id: crypto.randomUUID(),
                contactId: selectedContact.id,
                senderId: currentUser.id,
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
            await clearChatRequest(contactId, authToken ?? "");
        } catch {
            // Continue even if API fails
        }

        setMessages((previousMessages) =>
            previousMessages.filter((message) => message.contactId !== contactId),
        );
    };

    const deleteContact = async (contactId: string) => {
        try {
            await deleteContactRequest(contactId, authToken ?? "");
        } catch {
            // Continue even if API fails
        }

        setContacts((previousContacts) =>
            previousContacts.filter((contact) => contact.id !== contactId),
        );
        setMessages((previousMessages) =>
            previousMessages.filter((message) => message.contactId !== contactId),
        );

        if (selectedContactId === contactId) {
            const remaining = contacts.filter((c) => c.id !== contactId);
            setSelectedContactId(remaining.length > 0 ? remaining[0].id : "");
        }
    };

    const addContact = async (userId: string): Promise<ChatContact | null> => {
        const existing = contacts.find((c) => c.userId === userId);
        if (existing) {
            setSelectedContactId(existing.id);
            return existing;
        }

        try {
            const created = await createChatContactRequest(userId, authToken ?? "");
            const newContact: ChatContact = {
                id: created.id,
                userId: created.userId,
                user: created.user,
            };
            setContacts((previousContacts) => [...previousContacts, newContact]);
            setSelectedContactId(newContact.id);
            return newContact;
        } catch {
            return null;
        }
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
        deleteContact,
        addContact,
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
