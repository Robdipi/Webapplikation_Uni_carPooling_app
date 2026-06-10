import React, { useState, FormEvent } from "react";
import "../style.css";
import "./chatstyle.css";

// Types
interface Message {
    id: number;
    content: string;
    type: "send" | "received" | "image";
}

interface Contact {
    id: number;
    name: string;
    avatarUrl: string;
}

// Mock Data
const initialMessages: Message[] = [
    { id: 1, content: "hello", type: "received" },
    { id: 2, content: "can you drive me?", type: "send" },
    { id: 3, content: "yes", type: "received" },
    { id: 4, content: "Why werent you here ;(", type: "received" },
    { id: 5, content: "https://i.pinimg.com/736x/73/bb/46/73bb4608964f9abe087fd9fb40e45618.jpg", type: "image" },
];

const contacts: Contact[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: "Hans Zimmer",
    avatarUrl: "https://picsum.photos/200/300?random=" + (i + 1),
}));

// Components
const Header: React.FC = () => (
    <header className="page-header">
        <div className="logo">CampusRide</div>
        <nav>
            <Link to="/home" className="open-btn">Home</Link>
            <Link to="/chat" className="open-btn">Chat</Link>
            <Link to="/create_ride" className="open-btn">Fahrt anbieten</Link>
            <Link to="/find_ride" className="open-btn">Fahrt finden</Link>
            <Link to="/profile" className="open-btn">Profil</Link>
            <Link to="/" className="open-btn">Abmelden</Link>
        </nav>
    </header>
);

const MessageRow: React.FC<{ message: Message }> = ({ message }) => (
    <div className="message_row">
        {message.type === "image" ? (
            <div className="send">
                <img className="send_pic" src={message.content} alt="sent_image" />
            </div>
        ) : (
            <div className={message.type}>{message.content}</div>
        )}
    </div>
);

const ContactItem: React.FC<{ contact: Contact }> = ({ contact }) => (
    <div className="Contact">
        <img className="profile_pic" src={contact.avatarUrl} alt={`Profile of ${contact.name}`} />
        {contact.name}
    </div>
);

const ChatInput: React.FC<{ onSend: (message: string) => void }> = ({ onSend }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (text.trim() === "") return;
        onSend(text.trim());
        setText("");
    };

    return (
        <div className="write-message-container-holder">
            <form className="write-message-container" onSubmit={handleSubmit}>
                <button type="button" className="extra-btn">
                    <img src="../../images/Ui_elements/attach-document.png" alt="attach" style={{ width: 16, height: 16 }} />
                </button>
                <input
                    type="text"
                    id="chat-input"
                    className="chat-input"
                    placeholder="Nachricht an Hans Zimmer"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <button type="submit" className="send-btn">
                    <img src="../../images/Ui_elements/paper-plane.png" alt="send" style={{ width: 16, height: 16 }} />
                </button>
            </form>
        </div>
    );
};

// Main Chat Component
const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const handleSend = (messageText: string) => {
        const newMessage: Message = {
            id: messages.length + 1,
            content: messageText,
            type: "send",
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="page-layout">
            <Header />
                <div className="page-sidebar">
                    {contacts.map((contact) => (
                        <ContactItem key={contact.id} contact={contact} />
                    ))}
                </div>
                <div className="page-main">
                    {messages.map((msg) => (
                        <MessageRow key={msg.id} message={msg} />
                    ))}
                </div>
                <div className="page-footer">
                    <ChatInput onSend={handleSend} />
                </div>
        </div>
    );
};

export default ChatPage;