import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    type ChatContact,
    type ChatMessage,
    useChatContext,
} from "../../contexts/chatcontext";
import { useUserContext } from "../../contexts/usercontext";
import "../style.css";
import "./chatstyle.css";

const Header: React.FC = () => {
    const { currentUser, logoutUser } = useUserContext();

    return (
        <header className="page-header">
            <div className="logo">CampusRide</div>
            <nav>
                <Link to="/home" className="open-btn">
                    Home
                </Link>
                <Link to="/chat" className="open-btn">
                    Chat
                </Link>
                <Link to="/create-ride" className="open-btn">
                    Fahrt anbieten
                </Link>
                <Link to="/find-ride" className="open-btn">
                    Fahrt finden
                </Link>
                <Link to="/profile" className="open-btn">
                    Profil
                </Link>
                <Link to="/" className="open-btn" onClick={logoutUser}>
                    Abmelden
                </Link>
                {currentUser !== null && (
                    <span className="open-btn">
                        Hallo {currentUser.profile.firstName}
                    </span>
                )}
            </nav>
        </header>
    );
};

interface ContactItemProps {
    contact: ChatContact;
    isSelected: boolean;
    lastMessage?: ChatMessage;
    onSelect: (contactId: string) => void;
    onDelete: (contactId: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
    contact,
    isSelected,
    lastMessage,
    onSelect,
    onDelete,
}) => (
    <button
        type="button"
        className={isSelected ? "contact-item contact-item-selected" : "contact-item"}
        onClick={() => onSelect(contact.id)}
    >
        {contact.user.avatarUrl !== "" && (
            <img
                className="profile-pic"
                src={contact.user.avatarUrl}
                alt={`Profilbild von ${contact.name}`}
            />
        )}
        <span className="contact-text">
            <strong>{contact.name}</strong>
            <span className="contact-preview">
                {lastMessage?.content ?? "Noch keine Nachrichten"}
            </span>
        </span>
        <span
            className="contact-delete-btn"
            role="button"
            tabIndex={0}
            onClick={(event) => {
                event.stopPropagation();
                onDelete(contact.id);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    onDelete(contact.id);
                }
            }}
        >
            &times;
        </span>
    </button>
);

const MessageRow: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const messageClassName =
        message.sender === "me" ? "message-bubble message-send" : "message-bubble message-received";

    return (
        <div
            className={
                message.sender === "me"
                    ? "message-row message-row-send"
                    : "message-row message-row-received"
            }
        >
            <div className={messageClassName}>
                {message.type === "image" ? (
                    <img
                        className="send-pic"
                        src={message.content}
                        alt="Gesendetes Bild"
                    />
                ) : (
                    <span>{message.content}</span>
                )}
                <span className="message-time">{message.sentAt}</span>
            </div>
        </div>
    );
};

interface ChatInputProps {
    selectedContact: ChatContact;
    onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ selectedContact, onSend }) => {
    const [text, setText] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (text.trim() === "") {
            return;
        }

        onSend(text);
        setText("");
    };

    return (
        <div className="write-message-container-holder">
            <form className="write-message-container" onSubmit={handleSubmit}>
                <button type="button" className="extra-btn" aria-label="Datei anhängen">
                    📎
                </button>
                <input
                    type="text"
                    className="chat-input"
                    placeholder={`Nachricht an ${selectedContact.name}`}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />
                <button type="submit" className="send-btn" aria-label="Nachricht senden">
                    ➤
                </button>
            </form>
        </div>
    );
};

const ChatPage: React.FC = () => {
    const {
        contacts,
        selectedContactId,
        selectedContact,
        selectedMessages,
        selectContact,
        sendMessage,
        clearChat,
        deleteContact,
        getLastMessage,
    } = useChatContext();

    const mainRef = useRef<HTMLDivElement | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const pendingDeleteContact = pendingDeleteId !== null
        ? contacts.find((c) => c.id === pendingDeleteId)
        : undefined;

    const confirmDelete = () => {
        if (pendingDeleteId !== null) {
            deleteContact(pendingDeleteId);
            setPendingDeleteId(null);
        }
    };

    useEffect(() => {
        mainRef.current?.scrollTo({
            top: mainRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [selectedMessages]);

    return (
        <div className="chat-page-layout">
            <Header />

            <aside className="chat-sidebar">
                <h2 className="chat-sidebar-title">Chats</h2>
                {contacts.map((contact) => (
                    <ContactItem
                        key={contact.id}
                        contact={contact}
                        isSelected={contact.id === selectedContactId}
                        lastMessage={getLastMessage(contact.id)}
                        onSelect={selectContact}
                        onDelete={setPendingDeleteId}
                    />
                ))}
            </aside>

            <main className="chat-main">
                <section className="chat-conversation-header">
                    {selectedContact.user.avatarUrl !== "" && (
                        <img
                            className="conversation-avatar"
                            src={selectedContact.user.avatarUrl}
                            alt={`Profilbild von ${selectedContact.name}`}
                        />
                    )}
                    <div>
                        <h2>{selectedContact.name}</h2>
                        <p>CampusRide Chat</p>
                    </div>
                    <button
                        type="button"
                        className="clear-chat-button"
                        onClick={() => clearChat(selectedContact.id)}
                    >
                        Chat leeren
                    </button>
                </section>

                <div className="chat-messages" ref={mainRef}>
                    {selectedMessages.length === 0 ? (
                        <p className="empty-chat-message">
                            Noch keine Nachrichten mit {selectedContact.name}.
                        </p>
                    ) : (
                        selectedMessages.map((message) => (
                            <MessageRow key={message.id} message={message} />
                        ))
                    )}
                </div>
            </main>

            <footer className="chat-footer">
                <ChatInput selectedContact={selectedContact} onSend={sendMessage} />
            </footer>

            {pendingDeleteContact !== undefined && (
                <div className="confirm-overlay">
                    <div className="confirm-dialog">
                        <h3>Chat löschen?</h3>
                        <p>
                            Willst du den Chat mit <strong>{pendingDeleteContact.name}</strong> wirklich löschen?
                            Alle Nachrichten werden entfernt.
                        </p>
                        <div className="confirm-dialog-actions">
                            <button
                                type="button"
                                className="confirm-no"
                                onClick={() => setPendingDeleteId(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="confirm-yes"
                                onClick={confirmDelete}
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
