import { API_BASE_URL, readErrorMessage } from "./apiUtils";

export interface ApiCoordinates {
    lat: number;
    lng: number;
}

export interface ApiRide {
    id: string;
    departureName: string;
    destinationName: string;
    departureCoords: ApiCoordinates;
    destinationCoords: ApiCoordinates;
    distanceKm: number;
    durationMinutes: number;
    driverId: string;
    driverName: string;
    driverAvatarUrl: string;
    departureTime: string;
    seatsAvailable: number;
    price: number;
    extra: string;
}

export interface CreateRideRequest {
    departureName: string;
    destinationName: string;
    departureCoords: ApiCoordinates;
    destinationCoords: ApiCoordinates;
    distanceKm: number;
    durationMinutes: number;
    departureTime: string;
    seatsAvailable: number;
    price: number;
    extra: string;
}

export async function getRidesRequest(): Promise<ApiRide[]> {
    const response = await fetch(`${API_BASE_URL}/rides`);

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { rides: ApiRide[] };
    return data.rides;
}

export async function createRideRequest(
    input: CreateRideRequest,
    token: string,
): Promise<ApiRide> {
    const response = await fetch(`${API_BASE_URL}/rides`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            departureName: input.departureName,
            destinationName: input.destinationName,
            departureLat: input.departureCoords.lat,
            departureLng: input.departureCoords.lng,
            destinationLat: input.destinationCoords.lat,
            destinationLng: input.destinationCoords.lng,
            distanceKm: input.distanceKm,
            durationMinutes: input.durationMinutes,
            departureTime: input.departureTime,
            seatsAvailable: input.seatsAvailable,
            price: input.price,
            extra: input.extra,
        }),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { ride: ApiRide };
    return data.ride;
}

export async function updateRideRequest(
    id: string,
    updatedFields: Partial<CreateRideRequest>,
    token: string,
): Promise<ApiRide> {
    const body: Record<string, unknown> = {};
    if (updatedFields.departureName !== undefined) body.departureName = updatedFields.departureName;
    if (updatedFields.destinationName !== undefined) body.destinationName = updatedFields.destinationName;
    if (updatedFields.departureCoords !== undefined) {
        body.departureLat = updatedFields.departureCoords.lat;
        body.departureLng = updatedFields.departureCoords.lng;
    }
    if (updatedFields.destinationCoords !== undefined) {
        body.destinationLat = updatedFields.destinationCoords.lat;
        body.destinationLng = updatedFields.destinationCoords.lng;
    }
    if (updatedFields.distanceKm !== undefined) body.distanceKm = updatedFields.distanceKm;
    if (updatedFields.durationMinutes !== undefined) body.durationMinutes = updatedFields.durationMinutes;
    if (updatedFields.departureTime !== undefined) body.departureTime = updatedFields.departureTime;
    if (updatedFields.seatsAvailable !== undefined) body.seatsAvailable = updatedFields.seatsAvailable;
    if (updatedFields.price !== undefined) body.price = updatedFields.price;
    if (updatedFields.extra !== undefined) body.extra = updatedFields.extra;

    const response = await fetch(`${API_BASE_URL}/rides/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as { ride: ApiRide };
    return data.ride;
}

export async function deleteRideRequest(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rides/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
}
