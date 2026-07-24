import { API_BASE_URL, readErrorMessage } from "./apiUtils";

export interface ApiChatUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

export interface ApiChatContact {
    id: string;
    userId: string;
    user: ApiChatUser;
    messages: ApiChatMessage[];
}

export interface ApiChatMessage {
    id: string;
    contactId: string;
    senderId: string;
    sender: ApiChatUser;
    type: string;
    content: string;
    sentAt: string;
}

export async function getChatContactsRequest(token: string): Promise<ApiChatContact[]> {
    const response = await fetch(`${API_BASE_URL}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { contacts: ApiChatContact[] };
    return data.contacts;
}

export async function createChatContactRequest(
    userId: string,
    token: string,
): Promise<ApiChatContact> {
    const response = await fetch(`${API_BASE_URL}/chat/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { contact: ApiChatContact };
    return data.contact;
}

export async function sendMessageRequest(
    contactId: string,
    senderId: string,
    type: string,
    content: string,
    sentAt: string,
    token: string,
): Promise<ApiChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactId, senderId, type, content, sentAt }),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { message: ApiChatMessage };
    return data.message;
}

export async function clearChatRequest(contactId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${contactId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
}

export async function deleteContactRequest(contactId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/contacts/${contactId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
}
