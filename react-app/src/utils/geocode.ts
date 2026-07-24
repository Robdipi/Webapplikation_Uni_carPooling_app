import type { Coordinates } from "../contexts/ridecontext";

const NOMINATIM_HEADERS = {
    "User-Agent": "CampusRide/1.0 (university-project)",
};

export async function geocode(address: string): Promise<Coordinates | null> {
    if (address.trim() === "") {
        return null;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
            { headers: NOMINATIM_HEADERS },
        );

        const data = (await response.json()) as Array<{
            lat: string;
            lon: string;
        }>;

        if (data.length === 0) {
            return null;
        }

        return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
        };
    } catch {
        return null;
    }
}
