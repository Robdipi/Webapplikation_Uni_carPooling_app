import { createContext, useContext, useState } from "react";
const RideContext = createContext(null);



export function RideContextProvider({ children }) {
    const [rides, setRides] = useState([]);
    function addRide(ride) {
        const rideWithId = { id: crypto.randomUUID(), ...ride };
        setRides(prev => [...prev, rideWithId]);
    }
    function removeRide(id) {
        setRides(prev => prev.filter(ride => ride.id !== id));
    }
    function updateRide(id, updatedFields) {
        setRides(prev =>
            prev.map(ride =>
                ride.id === id ? { ...ride, ...updatedFields } : ride
            )
        );
    }
    function clearRides() {
        setRides([]);
    }
    return (
        <RideContext.Provider
            value={{
                rides,
                addRide,
                removeRide,
                updateRide,
                clearRides,
            }}
        >
            {children}
        </RideContext.Provider>
    );
}

export function useRideContext() {
    const context = useContext(RideContext);
    if (!context) {
        throw new Error(
            "useRideContext must be used within a RideContextProvider"
        );
    }
    return context;
}