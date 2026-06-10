import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import "../style.css";
import "../home/rout_recomendation.css";
import "./searchbar.css";

interface Ride {
    from: string;
    to: string;
    driver: string;
    time: string;
    seatsAvailable: number;
    price: number;
    avatarUrl: string;
    mapUrl: string;
}

const rides: Ride[] = [
    {
        from: "Bremen",
        to: "Hannover",
        driver: "Lisa",
        time: "15:00 Uhr",
        seatsAvailable: 3,
        price: 8,
        avatarUrl: "../../images/lisa.jpg",
        mapUrl: "../../images/map_placeholder.png",
    },
    {
        from: "Konstanz",
        to: "Radolfzell",
        driver: "Max",
        time: "08:30 Uhr",
        seatsAvailable: 2,
        price: 4,
        avatarUrl: "../../images/lisa.jpg",
        mapUrl: "../../images/map_placeholder.png",
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

const RideCard: React.FC<{ ride: Ride }> = ({ ride }) => (
    <li className="rides-list-entry">
        <div className="map-item">
            <div className="map">
                <img src={ride.mapUrl} alt="MapUI" className="karte" />
            </div>
        </div>
        <div className="ride-item">
            <article className="ride-card">
                <div className="ride-info">
                    <img
                        src={ride.avatarUrl}
                        alt={`Profilbild von ${ride.driver}`}
                        className="avatar"
                    />
                    <div className="details">
                        <h3>{ride.from} &rarr; {ride.to}</h3>
                        <p>
                            {ride.driver}, {ride.time}, {ride.seatsAvailable} freie Plätze,{" "}
                            <strong>€{ride.price}</strong>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </li>
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
