import React from "react";
import type { Ride } from "../../contexts/ridecontext";

interface RideCardProps {
    ride: Ride;
    selected?: boolean;
    onSelect?: (ride: Ride) => void;
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

const RideCard: React.FC<RideCardProps> = ({ ride, selected = false, onSelect }) => {
    const handleClick = () => {
        onSelect?.(ride);
    };

    return (
        <li>
            <button
                type="button"
                className={`ride-list-button ${selected ? "ride-list-button-selected" : ""}`}
                onClick={handleClick}
            >
                <article className="ride-card">
                    <div className="ride-info">
                        <img
                            src={ride.avatarUrl}
                            alt={`Profilbild von ${ride.driver}`}
                            className="avatar"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                        <div className="details">
                            <h3>
                                {ride.departureName} &rarr; {ride.destinationName}
                            </h3>
                            <p>
                                {ride.driver}, {formatDateTime(ride.departureTime)}, {ride.seatsAvailable} freie Plätze, <strong>€{ride.price}</strong>
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
