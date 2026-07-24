import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

export default Footer;
