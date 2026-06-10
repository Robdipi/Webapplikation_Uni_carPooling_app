import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Polyline,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Coordinates } from "../../contexts/ridecontext";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface LeafletDefaultIconPrototype extends L.Icon.Default {
    _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface RouteMapFromCoordsProps {
    departureCoords: Coordinates;
    destinationCoords: Coordinates;
}

function MapUpdater({
    start,
    end,
}: {
    start: Coordinates;
    end: Coordinates;
}) {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(
            [
                [start.lat, start.lng],
                [end.lat, end.lng],
            ],
            { padding: [40, 40] },
        );
    }, [start, end, map]);

    return null;
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
