import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import HomePageRouts from "./StartPage"; // This is your routes component
import "./pages/style.css";
import "./pages/popup.css";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <HomePageRouts /> {/* Render the routes component */}
        </BrowserRouter>
    </React.StrictMode>
);