import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

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
    driver: string;
    avatarUrl: string;
    departureTime: string;
    seatsAvailable: number;
    price: number;
    extra: string;
}

export type NewRide = Omit<Ride, "id">;

interface RideContextValue {
    rides: Ride[];
    addRide: (ride: NewRide) => Ride;
    removeRide: (id: string) => void;
    updateRide: (id: string, updatedFields: Partial<NewRide>) => void;
    clearRides: () => void;
}

interface RideContextProviderProps {
    children: ReactNode;
}

const RIDES_STORAGE_KEY = "campusride-rides";

function readRidesFromLocalStorage(): Ride[] {
    try {
        const stored = localStorage.getItem(RIDES_STORAGE_KEY);

        if (stored === null) {
            return [];
        }

        const parsed = JSON.parse(stored) as Ride[];

        if (!Array.isArray(parsed)) {
            return [];
        }

        // Alte Demo-Fahrten aus früheren Versionen nicht mehr anzeigen.
        return parsed.filter((ride) => !ride.id.startsWith("demo-"));
    } catch {
        return [];
    }
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideContextProvider({ children }: RideContextProviderProps) {
    const [rides, setRides] = useState<Ride[]>(readRidesFromLocalStorage);

    useEffect(() => {
        localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(rides));
    }, [rides]);

    const addRide = (ride: NewRide): Ride => {
        const rideWithId: Ride = {
            id: crypto.randomUUID(),
            ...ride,
        };

        setRides((previousRides) => [rideWithId, ...previousRides]);
        return rideWithId;
    };

    const removeRide = (id: string) => {
        setRides((previousRides) =>
            previousRides.filter((ride) => ride.id !== id),
        );
    };

    const updateRide = (id: string, updatedFields: Partial<NewRide>) => {
        setRides((previousRides) =>
            previousRides.map((ride) =>
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
