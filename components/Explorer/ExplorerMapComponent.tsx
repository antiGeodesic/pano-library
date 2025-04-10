import React, { useCallback, useEffect, useMemo } from 'react';
import { AdvancedMarker, APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useExplorerContext } from '@/contexts/ExplorerContext';
import { ArrowSvg } from '@/components/LocalEditor/MapComponent/ArrowSvg';


const containerStyle = {
    width: '100%',
    height: '100%',

};

const defaultCenter = {
    lat: 59.36187265426956,
    lng: 18.089235210029738,
};

const defaultZoom = 12;

class CoordMapType implements google.maps.MapType {
    tileSize: google.maps.Size;
    alt: string | null = null;
    maxZoom: number = 19;
    minZoom: number = 0;
    name: string | null = 'StreetViewThinLines';
    projection: google.maps.Projection | null = null;
    radius: number = 6378137;

    constructor(tileSize: google.maps.Size) {
        this.tileSize = tileSize;
    }
    getTile(
        coord: google.maps.Point,
        zoom: number,
        ownerDocument: Document
    ): HTMLElement {
        const div = ownerDocument.createElement("div");


        const tileUrl = `https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${coord.x}!3i${coord.y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e`;


        const img = ownerDocument.createElement("img");
        img.src = tileUrl;
        img.style.width = this.tileSize.width + "px";
        img.style.height = this.tileSize.height + "px";
        img.style.position = "absolute";
        img.style.left = "0";
        img.style.top = "0";

        div.appendChild(img);




        div.style.width = this.tileSize.width + "px";
        div.style.height = this.tileSize.height + "px";
        div.style.position = "relative";


        div.style.zIndex = "1";




        return div;
    }
    releaseTile(tile: Element): void {



        if (false) console.log("Releasing tile:", tile);
    }
}



const MapComponentContent: React.FC = () => {

    const map = useMap();


    const coordMapType = useMemo(() => {


        if (google?.maps?.Size) {
            return new CoordMapType(new google.maps.Size(256, 256));
        }
        return null;
    }, []);



    useEffect(() => {
        if (map && coordMapType) {


            map.overlayMapTypes.insertAt(0, coordMapType);


            return () => {


                let found = false;
                for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
                    if (map.overlayMapTypes.getAt(i) === coordMapType) {
                        map.overlayMapTypes.removeAt(i);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.warn("Could not find custom overlay instance to remove.");
                }
            };
        }

    }, [map, coordMapType]);











    return (
        <>

            {




            }



        </>
    );
};




const ExplorerMapComponent: React.FC = () => {
    const { displayedPanos } = useExplorerContext();
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const { clickedMap, loadNewPano } = useExplorerContext();
//
    // --- State for the "No Panorama" marker position (Lifted Up) ---
//
//
    // --- Map Click Handler (Lifted Up) ---
    const onMapClick = useCallback(async (event: MapMouseEvent) => {
        const latLngLiteral = event.detail?.latLng;
        if (!latLngLiteral) return;
        //-commented-console.log("Map clicked at (outer):", latLngLiteral);
//
        try {
            // clickedMap and loadNewPanorama come from context
            const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));
            //-commented-console.log("clickedMap result (outer):", localPano);
//
            if (localPano) {
                loadNewPano(localPano);
                // No need to set marker position if pano found
            }
        } catch (error) {
            console.error("Error during map click processing (outer):", error);
        }
    }, [clickedMap, loadNewPano]); // Dependencies from context
    /*const onMapClick = useCallback(async (event: MapMouseEvent) => {
    }, [clickedMap, loadNewPanorama]);*/


    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing...</div>;
    }

    return (
        <APIProvider apiKey={googleMapsApiKey} libraries={['marker', 'streetView', 'geometry']}>
            <div style={containerStyle}>
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    mapId={'4213f07b4e56a5ae'}
                    streetViewControl={false}
                    fullscreenControl={false}
                    mapTypeControl={false}
                    clickableIcons={false}
                    gestureHandling={'greedy'}
                    onClick={onMapClick}

                >
                    {/* Pass the marker position state down */}
                    {<MapComponentContent />}
                    <>
                        {displayedPanos.map((loc) => {
                            console.log(loc.lat, loc.lng); return (
                                <AdvancedMarker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={`${loc.description || 'Untitled'}`}>
                                    <ArrowSvg heading={loc.heading} size={45} rgb={{ r: 0, g: 0, b: 0 }} />
                                </AdvancedMarker>
                            )
                        })}
                    </>
                </Map>
            </div>
        </APIProvider>
    );
};

export default ExplorerMapComponent;