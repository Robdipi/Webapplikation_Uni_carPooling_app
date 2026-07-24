export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

export async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { error?: string };
        return data.error ?? "Die Anfrage ist fehlgeschlagen.";
    } catch {
        return "Die Anfrage ist fehlgeschlagen.";
    }
}
