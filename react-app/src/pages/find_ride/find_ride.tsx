import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import { type Ride, useRideContext } from "../../contexts/ridecontext";
import RideCard from "./rideCard";
import "../style.css";
import "../home/rout_recomendation.css";
import "./searchbar.css";
import RouteMapFromCoords from "../home/RouteMapFromCoords";

const Header: React.FC = () => {
    const { currentUser, logoutUser } = useUserContext();

    return (
        <header>
            <div className="logo">CampusRide</div>
            <nav>
                <Link to="/home" className="open-btn">Home</Link>
                <Link to="/chat" className="open-btn">Chat</Link>
                <Link to="/create-ride" className="open-btn">Fahrt anbieten</Link>
                <Link to="/find-ride" className="open-btn">Fahrt finden</Link>
                <Link to="/profile" className="open-btn">Profil</Link>
                <Link to="/" className="open-btn" onClick={logoutUser}>Abmelden</Link>
                {currentUser !== null && (
                    <span className="open-btn">Hallo {currentUser.profile.firstName}</span>
                )}
            </nav>
        </header>
    );
};

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

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

    const rideTime = rideDate.toTimeString().slice(0, 5);
    return rideTime >= time;
}

const FindRidePage: React.FC = () => {
    const { rides } = useRideContext();
    const [criteria, setCriteria] = useState<SearchCriteria>({
        from: "",
        to: "",
        date: "",
        time: "",
    });
    const [selectedRide, setSelectedRide] = useState<Ride | null>(rides[0] ?? null);

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

    useEffect(() => {
        if (filteredRides.length === 0) {
            setSelectedRide(null);
            return;
        }

        if (
            selectedRide === null ||
            !filteredRides.some((ride) => ride.id === selectedRide.id)
        ) {
            setSelectedRide(filteredRides[0]);
        }
    }, [filteredRides, selectedRide]);

    return (
        <div>
            <Header />
            <main>
                <h2>Fahrt finden</h2>
                <SearchBar onSearch={setCriteria} />

                <div className="campusride-map-card">
                    {selectedRide === null ? (
                        <div className="empty-state">Keine passende Fahrt gefunden.</div>
                    ) : (
                        <RouteMapFromCoords
                            departureCoords={selectedRide.departureCoords}
                            destinationCoords={selectedRide.destinationCoords}
                        />
                    )}
                </div>

                {selectedRide !== null && (
                    <section className="selected-ride-summary">
                        <h3>Ausgewählte Fahrt</h3>
                        <p>
                            {selectedRide.departureName} &rarr; {selectedRide.destinationName}
                        </p>
                    </section>
                )}

                <h3>Suchergebnisse</h3>
                <ul className="rides-list">
                    {filteredRides.map((ride) => (
                        <RideCard
                            key={ride.id}
                            ride={ride}
                            selected={selectedRide?.id === ride.id}
                            onSelect={setSelectedRide}
                        />
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default FindRidePage;
