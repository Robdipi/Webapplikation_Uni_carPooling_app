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
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Coordinates } from "../../contexts/ridecontext";
import { useDebounce } from "./useDebounce";

interface LeafletDefaultIconPrototype extends L.Icon.Default {
    _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface RouteMapProps {
    departure: string;
    destination: string;
}

function MapUpdater({
    start,
    end,
}: {
    start: Coordinates | null;
    end: Coordinates | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (start === null || end === null) {
            return;
        }

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

async function geocode(address: string): Promise<Coordinates | null> {
    if (address.trim() === "") {
        return null;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
        );

        const data = (await response.json()) as Array<{
            lat: string;
            lon: string;
        }>;

        if (data.length === 0) {
            return null;
        }

        return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
        };
    } catch {
        return null;
    }
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

                <MapUpdater start={startPoint} end={endPoint} />
            </MapContainer>
        </div>
    );
};

export default RouteMap;
