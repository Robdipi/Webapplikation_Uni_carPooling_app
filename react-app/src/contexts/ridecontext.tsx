import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export interface Ride {
    id: string;
    departure: string;
    destination: string;
    dateTime: string;
    seats: number;
    extra: string;
}

export type NewRide = Omit<Ride, "id">;
export type RideUpdate = Partial<NewRide>;

interface RideContextValue {
    rides: Ride[];
    addRide: (ride: NewRide) => void;
    removeRide: (id: string) => void;
    updateRide: (id: string, updatedFields: RideUpdate) => void;
    clearRides: () => void;
}

interface RideContextProviderProps {
    children: ReactNode;
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideContextProvider({ children }: RideContextProviderProps) {
    const [rides, setRides] = useState<Ride[]>([]);

    const addRide = (ride: NewRide) => {
        const rideWithId: Ride = { id: crypto.randomUUID(), ...ride };
        setRides((previousRides) => [...previousRides, rideWithId]);
    };

    const removeRide = (id: string) => {
        setRides((previousRides) =>
            previousRides.filter((ride) => ride.id !== id),
        );
    };

    const updateRide = (id: string, updatedFields: RideUpdate) => {
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
        throw new Error("useRideContext must be used within RideContextProvider");
    }

    return context;
}
