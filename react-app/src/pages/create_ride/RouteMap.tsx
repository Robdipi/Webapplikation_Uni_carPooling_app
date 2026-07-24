import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Polyline,
    TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletIconFix";
import type { Coordinates } from "../../contexts/ridecontext";
import { geocode } from "../../utils/geocode";
import MapUpdater from "../../components/MapUpdater";
import { useDebounce } from "./useDebounce";

interface RouteMapProps {
    departure: string;
    destination: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ departure, destination }) => {
    const [startPoint, setStartPoint] = useState<Coordinates | null>(null);
    const [endPoint, setEndPoint] = useState<Coordinates | null>(null);
    const [route, setRoute] = useState<[number, number][]>([]);
    const debouncedDeparture = useDebounce(departure, 800);
    const debouncedDestination = useDebounce(destination, 800);

    useEffect(() => {
        const loadRoute = async () => {
            const start = await geocode(debouncedDeparture);
            const end = await geocode(debouncedDestination);

            setStartPoint(start);
            setEndPoint(end);

            if (start === null || end === null) {
                setRoute([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
                );

                const data = (await response.json()) as {
                    routes?: Array<{
                        geometry?: {
                            coordinates?: Array<[number, number]>;
                        };
                    }>;
                };

                const coordinates = data.routes?.[0]?.geometry?.coordinates ?? [];
                const converted = coordinates.map(
                    ([lng, lat]) => [lat, lng] as [number, number],
                );

                setRoute(converted);
            } catch {
                setRoute([]);
            }
        };

        void loadRoute();
    }, [debouncedDeparture, debouncedDestination]);

    return (
        <div className="route-map-container">
            <MapContainer center={[47.6672, 9.1716]} zoom={12} className="leaflet-map">
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {startPoint !== null && <Marker position={[startPoint.lat, startPoint.lng]} />}
                {endPoint !== null && <Marker position={[endPoint.lat, endPoint.lng]} />}

                {route.length > 0 ? (
                    <Polyline positions={route} />
                ) : startPoint !== null && endPoint !== null ? (
                    <Polyline
                        positions={[
                            [startPoint.lat, startPoint.lng],
                            [endPoint.lat, endPoint.lng],
                        ]}
                    />
                ) : null}

                {startPoint !== null && endPoint !== null && (
                    <MapUpdater start={startPoint} end={endPoint} />
                )}
            </MapContainer>
        </div>
    );
};

export default RouteMap;
