import React from "react";
import type { Ride } from "../../contexts/ridecontext";

interface RideCardProps {
    ride: Ride;
    selected?: boolean;
    isOwnRide?: boolean;
    onSelect?: (ride: Ride) => void;
    onChatWithDriver?: (driverId: string, driverName: string) => void;
}

function formatDateTime(value: string): string {
    if (value.trim() === "") {
        return "Zeit offen";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const RideCard: React.FC<RideCardProps> = ({ ride, selected = false, isOwnRide = false, onSelect, onChatWithDriver }) => {
    const handleClick = () => {
        onSelect?.(ride);
    };

    const handleAvatarClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChatWithDriver?.(ride.driverId, ride.driverName);
    };

    return (
        <li>
            <button
                type="button"
                className={`ride-list-button ${selected ? "ride-list-button-selected" : ""} ${isOwnRide ? "ride-list-button-own" : ""}`}
                onClick={handleClick}
            >
                <article className="ride-card">
                    {ride.driverAvatarUrl !== "" && (
                        <img
                            className="ride-driver-avatar"
                            src={ride.driverAvatarUrl}
                            alt={`Profilbild von ${ride.driverName}`}
                            onClick={handleAvatarClick}
                            title={`Chat mit ${ride.driverName} starten`}
                        />
                    )}
                    <div className="ride-info">
                        <div className="details">
                            <h3>
                                {ride.departureName} &rarr; {ride.destinationName}
                            </h3>
                            <p>
                                {ride.driverName}, {formatDateTime(ride.departureTime)}, {ride.seatsAvailable} freie Plätze, <strong>€{ride.price}</strong>
                            </p>
                            <p>
                                ca. {ride.distanceKm.toFixed(1)} km · {ride.durationMinutes} min
                            </p>
                            {ride.extra.trim() !== "" && <p>{ride.extra}</p>}
                        </div>
                    </div>
                </article>
            </button>
        </li>
    );
};

export default RideCard;
