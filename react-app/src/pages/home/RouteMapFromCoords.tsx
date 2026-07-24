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
import MapUpdater from "../../components/MapUpdater";

interface RouteMapFromCoordsProps {
    departureCoords: Coordinates;
    destinationCoords: Coordinates;
}

const RouteMapFromCoords: React.FC<RouteMapFromCoordsProps> = ({
    departureCoords,
    destinationCoords,
}) => {
    const [route, setRoute] = useState<[number, number][]>([]);

    useEffect(() => {
        const loadRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${departureCoords.lng},${departureCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?overview=full&geometries=geojson`,
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
    }, [departureCoords, destinationCoords]);

    return (
        <div className="route-map-container">
            <MapContainer
                center={[departureCoords.lat, departureCoords.lng]}
                zoom={13}
                className="leaflet-map"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[departureCoords.lat, departureCoords.lng]} />
                <Marker position={[destinationCoords.lat, destinationCoords.lng]} />

                {route.length > 0 ? (
                    <Polyline positions={route} />
                ) : (
                    <Polyline
                        positions={[
                            [departureCoords.lat, departureCoords.lng],
                            [destinationCoords.lat, destinationCoords.lng],
                        ]}
                    />
                )}

                <MapUpdater start={departureCoords} end={destinationCoords} />
            </MapContainer>
        </div>
    );
};

export default RouteMapFromCoords;
