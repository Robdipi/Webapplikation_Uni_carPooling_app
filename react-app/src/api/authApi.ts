export interface ApiUserProfile {
    firstName: string;
    lastName: string;
    birthDate: string;
    course: string;
}

export interface ApiUser {
    id: string;
    email: string;
    username: string;
    profile: ApiUserProfile;
}

export interface AuthResponse {
    token: string;
    user: ApiUser;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    course: string;
}

export interface LoginRequest {
    identifier: string;
    password: string;
}

const API_BASE_URL = "http://localhost:3001/api";

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { error?: string };
        return data.error ?? "Die Anfrage ist fehlgeschlagen.";
    } catch {
        return "Die Anfrage ist fehlgeschlagen.";
    }
}

export async function registerUserRequest(input: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    return response.json() as Promise<AuthResponse>;
}

export async function loginUserRequest(input: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    return response.json() as Promise<AuthResponse>;
}

export async function getCurrentUserRequest(token: string): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { user: ApiUser };
    return data.user;
}
