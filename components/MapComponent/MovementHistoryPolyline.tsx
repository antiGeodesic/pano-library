// src/components/MovementHistoryPolyline.tsx

import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface HistoryPoint {
    panoId: string; // Assuming panoId is present, though not used for drawing
    lat: number;
    lng: number;
}

interface MovementHistoryPolylineProps {
    /** The array of historical points */
    history: HistoryPoint[];
    /** Polyline options */
    options?: Omit<google.maps.PolylineOptions, 'path' | 'map'>; // Exclude path/map
}

const defaultOptions: Omit<google.maps.PolylineOptions, 'path' | 'map'> = {
    strokeColor: '#FF0000', // Red color
    strokeOpacity: 0.8,
    strokeWeight: 3,
    clickable: false, // Usually don't need clicks on history lines
    draggable: false,
    editable: false,
    geodesic: true, // Draws the line following the curve of the Earth
};

export const MovementHistoryPolyline: React.FC<MovementHistoryPolylineProps> = ({
    history,
    options = {}, // Allow overriding defaults
}) => {
    const map = useMap();
    const polylineRef = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!map) {
            // Map not yet available
            return;
        }

        // Combine default and passed options
        const combinedOptions = { ...defaultOptions, ...options };

        // Check if we have enough points to draw a line
        if (history && history.length >= 2) {
            // Transform history data into LatLngLiterals for the path
            const path = history.map(point => ({ lat: point.lat, lng: point.lng }));

            if (!polylineRef.current) {
                // --- Create Polyline ---
                console.log("Creating Movement History Polyline");
                polylineRef.current = new google.maps.Polyline({
                    ...combinedOptions,
                    path: path,
                    map: map, // Add to map immediately
                });
            } else {
                // --- Update existing Polyline ---
                console.log("Updating Movement History Polyline path");
                polylineRef.current.setPath(path);
                 // Ensure options are updated if they change (optional)
                 // polylineRef.current.setOptions(combinedOptions);
                // Ensure it's on the map if it was previously removed
                if (!polylineRef.current.getMap()) {
                    polylineRef.current.setMap(map);
                }
            }
        } else {
            // --- Remove Polyline if not enough points or history is null/empty ---
            if (polylineRef.current) {
                console.log("Removing Movement History Polyline (not enough points)");
                polylineRef.current.setMap(null); // Remove from map
                // Optionally destroy the instance: polylineRef.current = null;
                // Keeping the instance might be slightly more performant if history reappears
            }
        }

        // --- Cleanup function ---
        // Runs on unmount or when dependencies (map, history, options) change BEFORE the effect runs again
        return () => {
            // Check if the polyline instance exists when cleaning up
             if (polylineRef.current) {
                 console.log("Cleaning up Movement History Polyline");
                 polylineRef.current.setMap(null); // Always remove from map on cleanup
                 // If you want to completely discard the instance on dependency change/unmount:
                 // polylineRef.current = null;
             }
        };
        // Dependencies: map instance, the history array reference, and options object reference
    }, [map, history, options]);

    // This component manages the polyline imperatively and renders nothing itself
    return null;
};