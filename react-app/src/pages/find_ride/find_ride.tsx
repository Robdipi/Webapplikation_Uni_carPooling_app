import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import "../style.css";
import "../home/rout_recomendation.css";
import "./searchbar.css";
import RideCard from "./rideCard";

interface Ride {
    id: number;
    departureName: string;
    destinationName: string;
    departureCoords: {
        lat: number;
        lng: number;
    };
    destinationCoords: {
        lat: number;
        lng: number;
    };
    distanceKm: number;
    durationMinutes: number;
    driver: string;
    avatarUrl: string;
    departureTime: string;
    seatsAvailable: number;
    price: number;
}

const rides: Ride[] = [
    {
        id: 1,

        departureName: "Bremen",
        destinationName: "Hannover",

        departureCoords: {
            lat: 53.0793,
            lng: 8.8017,
        },

        destinationCoords: {
            lat: 52.3759,
            lng: 9.7320,
        },

        distanceKm: 125,
        durationMinutes: 85,

        driver: "Lisa",
        avatarUrl: "../../images/lisa.jpg",

        departureTime: "2025-06-10T15:00:00",

        seatsAvailable: 3,
        price: 8,
    },

    {
        id: 2,

        departureName: "Konstanz",
        destinationName: "Radolfzell",

        departureCoords: {
            lat: 47.6779,
            lng: 9.1732,
        },

        destinationCoords: {
            lat: 47.7417,
            lng: 8.9705,
        },

        distanceKm: 19,
        durationMinutes: 22,

        driver: "Max",
        avatarUrl: "../../images/lisa.jpg",

        departureTime: "2025-06-11T08:30:00",

        seatsAvailable: 2,
        price: 4,
    },
];

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


interface SearchBarProps {
    onSearch: (from: string, to: string, date: string, time: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(from, to, date, time);
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
                        required
                    />
                    <img
                        src="../../images/Ui_elements/right-arrow.png"
                        alt="icon"
                        style={{ width: 16, height: 16 }}
                    />
                    <input
                        type="text"
                        className="searchbarinputfield"
                        placeholder="nach"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        required
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
                        <img
                            src="../../images/Ui_elements/search.png"
                            alt="icon"
                            style={{ width: 16, height: 16 }}
                        />{" "}
                        Suchen
                    </button>
                </form>
            </div>
        </div>
    );
};

const FindRidePage: React.FC = () => {
    const [filteredRides, setFilteredRides] = useState<Ride[]>(rides);

    const handleSearch = (from: string, to: string) => {
        const normalizedFrom = from.trim().toLowerCase();
        const normalizedTo = to.trim().toLowerCase();

        setFilteredRides(
            rides.filter(
                (ride) =>
                    ride.from.toLowerCase().includes(normalizedFrom) &&
                    ride.to.toLowerCase().includes(normalizedTo)
            )
        );
    };

    return (
        <div>
            <Header />
            <main>
                <h2>Fahrt finden</h2>
                <SearchBar onSearch={handleSearch} />
                <ul className="rides-list">
                    {filteredRides.map((ride) => (
                        <RideCard key={`${ride.from}-${ride.to}-${ride.time}`} ride={ride} />
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default FindRidePage;
