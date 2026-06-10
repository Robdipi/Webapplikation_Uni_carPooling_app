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

const demoRides: Ride[] = [
    {
        id: "demo-1",
        departureName: "HTWG Konstanz",
        destinationName: "Universität Konstanz",
        departureCoords: { lat: 47.6672, lng: 9.1716 },
        destinationCoords: { lat: 47.6897, lng: 9.1881 },
        distanceKm: 5.1,
        durationMinutes: 14,
        driver: "Lisa",
        avatarUrl: "/images/lisa.jpg",
        departureTime: "2026-06-12T08:00",
        seatsAvailable: 3,
        price: 3,
        extra: "Treffpunkt am Haupteingang.",
    },
    {
        id: "demo-2",
        departureName: "Konstanz Bahnhof",
        destinationName: "Radolfzell Bahnhof",
        departureCoords: { lat: 47.6595, lng: 9.1750 },
        destinationCoords: { lat: 47.7389, lng: 8.9706 },
        distanceKm: 22.4,
        durationMinutes: 28,
        driver: "Max",
        avatarUrl: "/images/lisa.jpg",
        departureTime: "2026-06-12T15:30",
        seatsAvailable: 2,
        price: 8,
        extra: "Kleiner Koffer ist okay.",
    },
];

function readRidesFromLocalStorage(): Ride[] {
    try {
        const stored = localStorage.getItem(RIDES_STORAGE_KEY);

        if (stored === null) {
            return demoRides;
        }

        const parsed = JSON.parse(stored) as Ride[];
        return Array.isArray(parsed) ? parsed : demoRides;
    } catch {
        return demoRides;
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
