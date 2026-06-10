import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

type Coordinates = {
    lat: number;
    lng: number;
};

type Props = {
    departureCoords: Coordinates;
    destinationCoords: Coordinates;
};

function MapUpdater({
                        start,
                        end,
                    }: {
    start: Coordinates;
    end: Coordinates;
}) {
    const map = useMap();

    useEffect(() => {
        map.fitBounds([
            [start.lat, start.lng],
            [end.lat, end.lng],
        ]);
    }, [start, end, map]);

    return null;
}

const RouteMapFromCoords = ({
                                departureCoords,
                                destinationCoords,
                            }: Props) => {
    const [route, setRoute] = useState<[number, number][]>([]);

    useEffect(() => {
        const loadRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${departureCoords.lng},${departureCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?overview=full&geometries=geojson`
                );

                const data = await response.json();

                const coordinates =
                    data.routes?.[0]?.geometry?.coordinates ?? [];

                const converted = coordinates.map(
                    ([lng, lat]: [number, number]) =>
                        [lat, lng] as [number, number]
                );

                setRoute(converted);
            } catch (error) {
                console.error("Failed to load route", error);
            }
        };

        loadRoute();
    }, [departureCoords, destinationCoords]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <MapContainer
                center={[
                    departureCoords.lat,
                    departureCoords.lng,
                ]}
                zoom={13}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={[
                        departureCoords.lat,
                        departureCoords.lng,
                    ]}
                />

                <Marker
                    position={[
                        destinationCoords.lat,
                        destinationCoords.lng,
                    ]}
                />

                {route.length > 0 && (
                    <Polyline
                        positions={route}
                    />
                )}

                <MapUpdater
                    start={departureCoords}
                    end={destinationCoords}
                />
            </MapContainer>
        </div>
    );
};

export default RouteMapFromCoords;