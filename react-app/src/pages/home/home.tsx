import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import { type Ride, useRideContext } from "../../contexts/ridecontext";
import { useChatContext } from "../../contexts/chatcontext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RouteMapFromCoords from "./RouteMapFromCoords";
import RideCard from "../find_ride/rideCard";
import "../style.css";
import "./rout_recomendation.css";
import "./popup.css";

const HomePage: React.FC = () => {
    const { currentUser } = useUserContext();
    const { rides } = useRideContext();
    const { addContact } = useChatContext();
    const navigate = useNavigate();
    const [selectedRide, setSelectedRide] = useState<Ride | null>(rides[0] ?? null);

    const handleChatWithDriver = async (driverId: string) => {
        if (currentUser === null) {
            return;
        }

        const contact = await addContact(driverId);
        navigate("/chat", { state: { selectedContactId: contact?.id } });
    };

    const effectiveSelectedRide =
        selectedRide !== null && rides.some((ride) => ride.id === selectedRide.id)
            ? selectedRide
            : rides[0] ?? null;

    return (
        <div>
            <Header />
            <main>
                <h2>
                    {currentUser === null
                        ? "Fahrten in deiner Nähe"
                        : `Fahrten in deiner Nähe, ${currentUser.profile.firstName}`}
                </h2>

                <div className="campusride-map-card">
                    {effectiveSelectedRide === null ? (
                        <div className="empty-state">Es gibt noch keine Fahrten.</div>
                    ) : (
                        <RouteMapFromCoords
                            departureCoords={effectiveSelectedRide.departureCoords}
                            destinationCoords={effectiveSelectedRide.destinationCoords}
                        />
                    )}
                </div>

                {effectiveSelectedRide !== null && (
                    <section className="selected-ride-summary">
                        <h3>Ausgewählte Fahrt</h3>
                        <p>
                            {effectiveSelectedRide.departureName} &rarr; {effectiveSelectedRide.destinationName}
                        </p>
                        <p>
                            {effectiveSelectedRide.driverName} · {effectiveSelectedRide.seatsAvailable} freie Plätze · €{effectiveSelectedRide.price}
                        </p>
                    </section>
                )}

                <h3>Verfügbare Fahrten</h3>
                <ul className="rides-list">
                    {rides.map((ride) => (
                        <RideCard
                            key={ride.id}
                            ride={ride}
                            selected={effectiveSelectedRide?.id === ride.id}
                            isOwnRide={currentUser !== null && ride.driverId === currentUser.id}
                            onSelect={setSelectedRide}
                            onChatWithDriver={handleChatWithDriver}
                            onOwnAvatarClick={() => navigate("/profile")}
                        />
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
