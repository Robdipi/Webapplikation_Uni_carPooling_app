import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import "./profile.css";

// Types
interface Profile {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    pricePerKm: string;
    course: string;
}

// Mock data
const initialProfile: Profile = {
    firstName: "Max",
    lastName: "Mustermann",
    birthDate: "01.01.2000",
    city: "Konstanz",
    pricePerKm: "0,60 €",
    course: "Allgemeine Informatik (AIN)",
};

// Header
const Header: React.FC = () => (
    <header>
        <div className="logo">CampusRide</div>
        <nav>
            <Link to="/home" className="open-btn">Home</Link>
            <Link to="/chat" className="open-btn">Chat</Link>
            <Link to="/create-ride" className="open-btn">Fahrt anbieten</Link>
            <Link to="/find-ride" className="open-btn">Fahrt finden</Link>
            <Link to="/profile" className="open-btn">Profil</Link>
            <Link to="/" className="open-btn">Abmelden</Link>
        </nav>
    </header>
);

// Profile field component
const ProfileField: React.FC<{ label: string; value: string }> = ({
                                                                      label,
                                                                      value,
                                                                  }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="profile-field">{value}</div>
    </div>
);

// Main component
const ProfilePage: React.FC = () => {
    const [profile] = useState<Profile>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <div>
            <Header />

            <main>
                <div className="content-wrapper">
                    <section>
                        <h2>Profil anzeigen</h2>
                            <ProfileField label="Vorname" value={profile.firstName} />
                            <ProfileField label="Nachname" value={profile.lastName} />
                            <ProfileField label="Geburtsdatum" value={profile.birthDate} />
                            <ProfileField label="Wohnort" value={profile.city} />
                            <ProfileField label="Preis pro km" value={profile.pricePerKm} />
                            <ProfileField label="Studiengang" value={profile.course} />
                    </section>
                </div>

                <div className="edit-button-wrapper">
                    <button
                        className="create-ride-submit-button"
                        onClick={handleEditToggle}
                    >
                        {isEditing ? "Bearbeitung beenden" : "Profil bearbeiten"}
                    </button>
                </div>
            </main>

            <footer>
                <Link to="/impressum" className="extra-info-btn">
                    Impressum
                </Link>{" "}
                | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
                <a href="#" className="extra-info-btn">Kontakt</a>
            </footer>
        </div>
    );
};

export default ProfilePage;