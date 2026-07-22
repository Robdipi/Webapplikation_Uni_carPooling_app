import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useUserContext } from "./usercontext";
import {
    getRidesRequest,
    createRideRequest,
    updateRideRequest,
    deleteRideRequest,
} from "../api/rideApi";

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Ride {
    id: string;
    departureName: string;
    destinationName: string;
    departureCoords: Coordinates;
    destinationCoords: Coordinates;
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

export type NewRide = Omit<Ride, "id">;

interface RideContextValue {
    rides: Ride[];
    addRide: (ride: NewRide) => Promise<Ride>;
    removeRide: (id: string) => Promise<void>;
    updateRide: (id: string, updatedFields: Partial<NewRide>) => Promise<void>;
    clearRides: () => void;
}

interface RideContextProviderProps {
    children: ReactNode;
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideContextProvider({ children }: RideContextProviderProps) {
    const [rides, setRides] = useState<Ride[]>([]);
    const { authToken } = useUserContext();

    useEffect(() => {
        async function loadRides() {
            try {
                const apiRides = await getRidesRequest();
                setRides(apiRides);
            } catch {
                console.error("Fahrten konnten nicht geladen werden.");
            }
        }

        loadRides();
    }, []);

    const addRide = async (ride: NewRide): Promise<Ride> => {
        if (authToken === null) {
            throw new Error("Nicht angemeldet.");
        }

        const created = await createRideRequest(ride, authToken);
        setRides((previous) => [created, ...previous]);
        return created;
    };

    const removeRide = async (id: string) => {
        if (authToken === null) {
            throw new Error("Nicht angemeldet.");
        }

        await deleteRideRequest(id, authToken);
        setRides((previous) => previous.filter((ride) => ride.id !== id));
    };

    const updateRide = async (id: string, updatedFields: Partial<NewRide>) => {
        if (authToken === null) {
            throw new Error("Nicht angemeldet.");
        }

        await updateRideRequest(id, updatedFields, authToken);
        setRides((previous) =>
            previous.map((ride) =>
                ride.id === id ? { ...ride, ...updatedFields } : ride,
            ),
        );
    };

    const clearRides = () => {
        setRides([]);
    };

    return (
        <RideContext.Provider
            value={{ rides, addRide, removeRide, updateRide, clearRides }}
        >
            {children}
        </RideContext.Provider>
    );
}

export function useRideContext(): RideContextValue {
    const context = useContext(RideContext);

    if (context === undefined) {
        throw new Error("useRideContext must be used within a RideContextProvider");
    }

    return context;
}
