import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import { type Ride, useRideContext } from "../../contexts/ridecontext";
import { useChatContext } from "../../contexts/chatcontext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RideCard from "./rideCard";
import "../style.css";
import "../home/rout_recomendation.css";
import "./searchbar.css";
import RouteMapFromCoords from "../home/RouteMapFromCoords";

interface SearchCriteria {
    from: string;
    to: string;
    date: string;
    time: string;
}

interface SearchBarProps {
    onSearch: (criteria: SearchCriteria) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch({ from, to, date, time });
    };

    return (
        <div className="searchbar-holder">
            <div className="searchbar">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="searchbarinputfield"
                        placeholder="von"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                    />
                    <span className="searchbar-arrow">→</span>
                    <input
                        type="text"
                        className="searchbarinputfield"
                        placeholder="nach"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                    />
                    <label htmlFor="date" className="seachbar-label">Am:</label>
                    <input
                        type="date"
                        className="searchbarinputfield"
                        id="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />
                    <label htmlFor="time" className="seachbar-label">Um:</label>
                    <input
                        type="time"
                        className="searchbarinputfield"
                        id="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                    />
                    <button type="submit" className="search-bar-submit-button">
                        Suchen
                    </button>
                </form>
            </div>
        </div>
    );
};

function matchesDate(ride: Ride, date: string): boolean {
    if (date === "") {
        return true;
    }

    return ride.departureTime.startsWith(date);
}

function matchesTime(ride: Ride, time: string): boolean {
    if (time === "") {
        return true;
    }

    const rideDate = new Date(ride.departureTime);

    if (Number.isNaN(rideDate.getTime())) {
        return true;
    }

    const rideHours = rideDate.getHours().toString().padStart(2, "0");
    const rideMinutes = rideDate.getMinutes().toString().padStart(2, "0");
    const rideTime = `${rideHours}:${rideMinutes}`;

    const [searchHours, searchMinutes] = time.split(":").map(Number);
    const [rideH, rideM] = rideTime.split(":").map(Number);
    const searchTotal = searchHours * 60 + searchMinutes;
    const rideTotal = rideH * 60 + rideM;

    return Math.abs(rideTotal - searchTotal) <= 60;
}

const FindRidePage: React.FC = () => {
    const { rides } = useRideContext();
    const { addContact } = useChatContext();
    const { currentUser } = useUserContext();
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState<SearchCriteria>({
        from: "",
        to: "",
        date: "",
        time: "",
    });
    const [selectedRide, setSelectedRide] = useState<Ride | null>(rides[0] ?? null);

    const handleChatWithDriver = async (driverId: string) => {
        if (currentUser === null) {
            return;
        }

        const contact = await addContact(driverId);
        navigate("/chat", { state: { selectedContactId: contact?.id } });
    };

    const filteredRides = useMemo(() => {
        const normalizedFrom = criteria.from.trim().toLowerCase();
        const normalizedTo = criteria.to.trim().toLowerCase();

        return rides.filter((ride) => {
            const matchesFrom =
                normalizedFrom === "" ||
                ride.departureName.toLowerCase().includes(normalizedFrom);

            const matchesTo =
                normalizedTo === "" ||
                ride.destinationName.toLowerCase().includes(normalizedTo);

            return (
                matchesFrom &&
                matchesTo &&
                matchesDate(ride, criteria.date) &&
                matchesTime(ride, criteria.time)
            );
        });
    }, [rides, criteria]);

    const effectiveSelectedRide =
        selectedRide !== null && filteredRides.some((ride) => ride.id === selectedRide.id)
            ? selectedRide
            : filteredRides[0] ?? null;

    return (
        <div>
            <Header />
            <main>
                <h2>Fahrt finden</h2>
                <SearchBar onSearch={setCriteria} />

                <div className="campusride-map-card">
                    {effectiveSelectedRide === null ? (
                        <div className="empty-state">Keine passende Fahrt gefunden.</div>
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
                    </section>
                )}

                <h3>Suchergebnisse</h3>
                <ul className="rides-list">
                    {filteredRides.map((ride) => (
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

export default FindRidePage;
