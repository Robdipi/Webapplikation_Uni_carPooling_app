import { API_BASE_URL, readErrorMessage } from "./apiUtils";

export interface ApiUserProfile {
    firstName: string;
    lastName: string;
    birthDate: string;
    course: string;
    city: string;
    pricePerKm: number;
    avatarUrl: string;
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
    avatarUrl?: string;
}

export interface LoginRequest {
    identifier: string;
    password: string;
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

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    course?: string;
    city?: string;
    pricePerKm?: number;
    avatarUrl?: string;
}

export async function updateProfileRequest(
    token: string,
    input: UpdateProfileRequest,
): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { user: ApiUser };
    return data.user;
}
