import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext, UserProfile } from "../../contexts/usercontext";
import "../style.css";
import "./profile.css";

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

interface ProfileFieldProps {
    label: string;
    value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="profile-field">{value}</div>
    </div>
);

interface ProfileInputProps {
    label: string;
    name: keyof UserProfile;
    value: string;
    type?: string;
    onChange: (name: keyof UserProfile, value: string) => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
    label,
    name,
    value,
    type = "text",
    onChange,
}) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(event) => onChange(name, event.target.value)}
        />
    </div>
);

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

const ProfilePage: React.FC = () => {
    const { currentUser, profile, setProfile } = useUserContext();
    const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleEdit = () => {
        setDraftProfile(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraftProfile(profile);
        setIsEditing(false);
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProfile(draftProfile);
        setIsEditing(false);
    };

    const handleInputChange = (name: keyof UserProfile, value: string) => {
        setDraftProfile((previousProfile) => ({
            ...previousProfile,
            [name]: value,
        }));
    };

    return (
        <div>
            <Header />

            <main>
                <div className="content-wrapper">
                    <section>
                        <h2>{isEditing ? "Profil bearbeiten" : "Profil anzeigen"}</h2>

                        {currentUser === null ? (
                            <p>
                                Du bist aktuell nicht angemeldet. Bitte gehe zurück zur{" "}
                                <Link to="/">Startseite</Link>.
                            </p>
                        ) : isEditing ? (
                            <form onSubmit={handleSave}>
                                <ProfileInput
                                    label="Vorname"
                                    name="firstName"
                                    value={draftProfile.firstName}
                                    onChange={handleInputChange}
                                />
                                <ProfileInput
                                    label="Nachname"
                                    name="lastName"
                                    value={draftProfile.lastName}
                                    onChange={handleInputChange}
                                />
                                <ProfileInput
                                    label="Geburtsdatum"
                                    name="birthDate"
                                    type="date"
                                    value={draftProfile.birthDate}
                                    onChange={handleInputChange}
                                />
                                <ProfileInput
                                    label="Wohnort"
                                    name="city"
                                    value={draftProfile.city}
                                    onChange={handleInputChange}
                                />
                                <ProfileInput
                                    label="Preis pro km"
                                    name="pricePerKm"
                                    value={draftProfile.pricePerKm}
                                    onChange={handleInputChange}
                                />
                                <ProfileInput
                                    label="Studiengang"
                                    name="course"
                                    value={draftProfile.course}
                                    onChange={handleInputChange}
                                />

                                <div className="edit-button-wrapper">
                                    <button
                                        type="button"
                                        className="create-ride-submit-button"
                                        onClick={handleCancel}
                                    >
                                        Abbrechen
                                    </button>
                                    <button type="submit" className="create-ride-submit-button">
                                        Änderungen speichern
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <ProfileField label="Vorname" value={profile.firstName} />
                                <ProfileField label="Nachname" value={profile.lastName} />
                                <ProfileField label="Geburtsdatum" value={profile.birthDate} />
                                <ProfileField label="Wohnort" value={profile.city} />
                                <ProfileField label="Preis pro km" value={profile.pricePerKm} />
                                <ProfileField label="Studiengang" value={profile.course} />

                                <div className="edit-button-wrapper">
                                    <button
                                        type="button"
                                        className="create-ride-submit-button"
                                        onClick={handleEdit}
                                    >
                                        Profil bearbeiten
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
