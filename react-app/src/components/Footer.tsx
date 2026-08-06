import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <Link to="/copyright" className="extra-info-btn">Copyright</Link> |{" "}
        <Link to="/contact" className="extra-info-btn">Kontakt</Link>
    </footer>
);

export default Footer;
