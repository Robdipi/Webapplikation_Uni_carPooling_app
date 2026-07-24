import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/usercontext";

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const { currentUser, logoutUser } = useUserContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <header className={className}>
            <div className="logo">CampusRide</div>
            <nav>
                <Link to="/home" className="open-btn">Home</Link>
                <Link to="/chat" className="open-btn">Chat</Link>
                <Link to="/create-ride" className="open-btn">Fahrt anbieten</Link>
                <Link to="/find-ride" className="open-btn">Fahrt finden</Link>
                <Link to="/profile" className="open-btn">Profil</Link>
                <button type="button" className="logout-btn" onClick={handleLogout}>
                    Abmelden
                </button>
                {currentUser !== null && (
                    <span className="open-btn">Hallo {currentUser.profile.firstName}</span>
                )}
            </nav>
        </header>
    );
};

export default Header;
