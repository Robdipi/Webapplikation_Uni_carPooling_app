import React, { useState } from "react";
import "../style.css";
import "./profile.css";

// Datenmodell für ein Profil
interface Profile {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    pricePerKm: string;
    course: string;
}

// Startwerte
const initialProfile: Profile = {
    firstName: "Max",
    lastName: "Mustermann",
    birthDate: "2000-01-01",
    city: "Konstanz",
    pricePerKm: "0,60 €",
    course: "Allgemeine Informatik (AIN)",
};

// Header-Komponente
const Header: React.FC = () => (
    <header>
        <div className="logo">
            <a href="../home/home.html" className="open-btn">
                CampusRide
            </a>
        </div>
    </header>
);

// Props für ProfileField
interface ProfileFieldProps {
    label: string;
    value: string;
}

// Komponente zum Anzeigen eines Profilfelds
const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="profile-field">{value}</div>
    </div>
);

// Props für ProfileInput
interface ProfileInputProps {
    label: string;
    name: keyof Profile;
    value: string;
    type?: string;
    onChange: (name: keyof Profile, value: string) => void;
}

// Komponente zum Bearbeiten eines Profilfelds
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

// Footer-Komponente
const Footer: React.FC = () => (
    <footer>
        <a href="../impressum/impressum.html" className="extra-info-btn">
            Impressum
        </a>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

// Hauptkomponente der Profilseite
const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [draftProfile, setDraftProfile] = useState<Profile>(initialProfile);
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

    const handleInputChange = (name: keyof Profile, value: string) => {
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

                        {isEditing ? (
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

                                    <button
                                        type="submit"
                                        className="create-ride-submit-button"
                                    >
                                        Änderungen speichern
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <ProfileField
                                    label="Vorname"
                                    value={profile.firstName}
                                />

                                <ProfileField
                                    label="Nachname"
                                    value={profile.lastName}
                                />

                                <ProfileField
                                    label="Geburtsdatum"
                                    value={profile.birthDate}
                                />

                                <ProfileField
                                    label="Wohnort"
                                    value={profile.city}
                                />

                                <ProfileField
                                    label="Preis pro km"
                                    value={profile.pricePerKm}
                                />

                                <ProfileField
                                    label="Studiengang"
                                    value={profile.course}
                                />

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