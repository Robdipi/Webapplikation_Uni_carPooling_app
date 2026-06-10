import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useDebounce } from "./useDebounce";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

type Props = {
    departure: string;
    destination: string;
};

type LatLng = {
    lat: number;
    lng: number;
};

function MapUpdater({
                        start,
                        end,
                    }: {
    start: LatLng | null;
    end: LatLng | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        map.fitBounds([
            [start.lat, start.lng],
            [end.lat, end.lng],
        ]);
    }, [start, end, map]);

    return null;
}

const RouteMap = ({ departure, destination }: Props) => {
    const [startPoint, setStartPoint] = useState<LatLng | null>(null);
    const [endPoint, setEndPoint] = useState<LatLng | null>(null);
    const [route, setRoute] = useState<[number, number][]>([]);
    const debouncedDeparture = useDebounce(departure, 1000);
    const debouncedDestination = useDebounce(destination, 1000);

    async function geocode(address: string): Promise<LatLng | null> {
        if (!address.trim()) return null;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    address
                )}`
            );

            const data = await response.json();

            if (!data.length) return null;

            return {
                lat: Number(data[0].lat),
                lng: Number(data[0].lon),
            };
        } catch {
            return null;
        }
    }

    useEffect(() => {
        const loadRoute = async () => {
            if (!debouncedDeparture || !debouncedDestination) {
                setRoute([]);
                return;
            }

            const start = await geocode(debouncedDeparture);
            const end = await geocode(debouncedDestination);

            if (!start || !end) {
                setRoute([]);
                return;
            }

            setStartPoint(start);
            setEndPoint(end);

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
                );

                const data = await response.json();

                const coordinates =
                    data.routes?.[0]?.geometry?.coordinates ?? [];

                const converted = coordinates.map(
                    ([lng, lat]: [number, number]) =>
                        [lat, lng] as [number, number]
                );

                setRoute(converted);
            } catch {
                setRoute([]);
            }
        };

        loadRoute();
    }, [debouncedDeparture, debouncedDestination]);

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "20px auto",
                padding: "0 20px",
            }}
        >
            <MapContainer
                center={[47.659, 9.175]}
                zoom={13}
                style={{
                    height: "350px",
                    width: "100%",
                    borderRadius: "12px",
                }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {startPoint && (
                    <Marker position={[startPoint.lat, startPoint.lng]} />
                )}

                {endPoint && (
                    <Marker position={[endPoint.lat, endPoint.lng]} />
                )}

                {route.length > 0 && (
                    <Polyline positions={route} />
                )}

                <MapUpdater
                    start={startPoint}
                    end={endPoint}
                />
            </MapContainer>
        </div>
    );
};

export default RouteMap;