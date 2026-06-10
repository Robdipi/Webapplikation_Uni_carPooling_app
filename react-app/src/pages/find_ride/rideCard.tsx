import {Ride} from "../../contexts/ridecontext";
import {useState} from "react";
import Route from "./RouteMapFromCoords";
const RideCard: React.FC<{ ride: Ride }> = ({ ride }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li className="rides-list-entry">
            <article className="ride-card">

                <div className="ride-info">

                    <img
                        src={ride.avatarUrl}
                        alt={ride.driver}
                        className="avatar"
                    />

                    <div className="details">

                        <h3>
                            {ride.departureName} → {ride.destinationName}
                        </h3>

                        <p>{ride.driver}</p>

                        <p>
                            {ride.distanceKm} km ·
                            {" "}
                            {ride.durationMinutes} min ·
                            {" "}
                            {ride.seatsAvailable} Plätze ·
                            {" "}
                            €{ride.price}
                        </p>

                    </div>
                </div>

                <button
                    className="map-toggle-btn"
                    onClick={() => setExpanded(!expanded)}
                >
                    🗺️
                </button>

                {expanded && (
                    <div className="expanded-map">
                        <RouteMapFromCoords
                            departureCoords={ride.departureCoords}
                            destinationCoords={ride.destinationCoords}
                        />
                    </div>
                )}

            </article>
        </li>
    );
};
export default RideCard;