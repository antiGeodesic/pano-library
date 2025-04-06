import React, { useRef, useEffect } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

/*interface StreetViewComponentProps {
    onMoveEvent: (moveValues: { panoId: string, lat: number, lng: number }) => void;
    onLookEvent: (lookValues: { heading: number, pitch: number, zoom: number }) => void;
}*/
const StreetViewComponent: React.FC/*<StreetViewComponentProps>*/ = () => {
    const { currentPanorama, displayedPanorama, setDisplayedPanorama } = useLocalEditorContext();
    const streetViewRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama>(null);
    const panoListenerRef = useRef<google.maps.MapsEventListener | null>(null);
    const povListenerRef = useRef<google.maps.MapsEventListener | null>(null);
    useEffect(() => {
        console.log("AAAAAAAAAAAAAA")
        if (streetViewRef.current && currentPanorama) {
            if(!panoramaRef.current){
                const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
                    position: { lat: currentPanorama.lat, lng: currentPanorama.lng },
                    pov: { heading: currentPanorama.heading, pitch: currentPanorama.pitch },
                    zoom: currentPanorama.zoom
                };
                panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, panoramaOptions);
            }
            
            if (panoramaRef.current) {
                panoListenerRef.current = google.maps.event.addListener(panoramaRef.current, 'pano_changed', () => {
                    if (!panoramaRef.current) return;
                    const coord = panoramaRef.current.getPosition();
                    if (coord) {
                        const newSvPanoramaValues = {
                            panoId: panoramaRef.current.getPano(),
                            lat: coord.lat(),
                            lng: coord.lng(),
                            /*heading: pov.heading,
                            pitch: pov.pitch,
                            zoom: panorama.getZoom()*/
                        }
                        //onMoveEvent(newSvPanoramaValues);
                        setDisplayedPanorama({...currentPanorama, ...displayedPanorama, ...newSvPanoramaValues});
                    }
                });
            }
            if (panoramaRef.current) {
                povListenerRef.current = google.maps.event.addListener(panoramaRef.current, 'pano_changed', () => {
                    if (!panoramaRef.current) return;
                    const pov = panoramaRef.current.getPov();
                    if (pov) {
                        const newSvPanoramaValues = {
                            /*panoId: panorama.getPano(),
                            lat: coord.lat(),
                            lng: coord.lng(),*/
                            heading: pov.heading,
                            pitch: pov.pitch,
                            zoom: panoramaRef.current.getZoom()
                        }
                        //onLookEvent(newSvPanoramaValues);
                        setDisplayedPanorama({...currentPanorama, ...displayedPanorama, ...newSvPanoramaValues});
                    }
                });
            }
            /*setCurrentSvPanorama(panorama);
            console.log("✅ - Set Current StreetView Panorama: ", panorama);
            console.log("✅ - Set Current StreetView Panorama (context): ", currentSvPanorama)

            return () => {
                // Cleanup: Reset panorama when component unmounts
                console.log("❌ - Cleared Current Street View Panorama")
                setCurrentSvPanorama(null);
            };*/
        }

    }, [currentPanorama, displayedPanorama, setDisplayedPanorama]);

    return (
        <div ref={streetViewRef} style={{ width: '100%', height: '400px' }}>
            {/* This div will hold the street view panorama */}
        </div>
    );
};

export default StreetViewComponent;
