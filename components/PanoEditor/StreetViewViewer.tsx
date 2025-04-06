import React, { useEffect, useRef } from 'react';
import { useLocalEditorContext  } from '@/contexts/LocalEditorContext';
import styles from '@/styles/Home.module.css';

interface StreetViewViewerProps {
  className?: string;
}

const StreetViewViewer: React.FC<StreetViewViewerProps> = ({ className = styles.streetView }) => {
  const {
    currentPanorama,
    updateCurrentPov,
    updateCurrentPos,
  } = useLocalEditorContext();

  const streetViewRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!streetViewRef.current || !currentPanorama || !window.google || !window.google.maps) {
      return;
    }

    if (!panoramaRef.current) {
      panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
        pano: currentPanorama.panoId,
        visible: true,
        addressControl: true,
        linksControl: true,
        fullscreenControl: false,
        enableCloseButton: false,
        showRoadLabels: false,
        imageDateControl: true,
        pov: {
          heading: currentPanorama.heading || 0,
          pitch: currentPanorama.pitch || 0,
        },
        zoom: currentPanorama.zoom || 1
      });

      panoramaRef.current.addListener('pov_changed', () => {
        const pov = panoramaRef.current?.getPov();
        const zoom = panoramaRef.current?.getZoom() || 1;
        if(pov && zoom) {
          updateCurrentPov(
            pov.heading || 0,
            pov.pitch || 0,
            zoom,
          );
        }
        
      });
      panoramaRef.current.addListener('position_changed', () => {
        const panoId = panoramaRef.current?.getPano();
        const pos = panoramaRef.current?.getPosition();
        if(panoId && pos?.lat() && pos?.lng()) {
          updateCurrentPos(
            panoId,
            pos.lat(),
            pos.lng()
          );
        }
        
      });
    } else if (panoramaRef.current.getPano() !== currentPanorama.panoId) {
      panoramaRef.current.setPano(currentPanorama.panoId);
    }
  }, [currentPanorama, updateCurrentPov, updateCurrentPos]);

  return <div ref={streetViewRef} className={className} />;
};

export default StreetViewViewer;
/*import React, { useEffect, useRef, useContext } from 'react';
import { useLocalEditorContext  } from '@/contexts/LocalEditorContext';
import styles from '@/styles/Home.module.css';

interface StreetViewViewerProps {
  className?: string;
}

const StreetViewViewer: React.FC<StreetViewViewerProps> = ({ className = styles.streetView }) => {
  const {
    currentPanorama,
    updateCurrentPov,
    updateCurrentPos,
    setCurrentPanorama
  } = useLocalEditorContext();

  if(!currentPanorama) {
    console.warn("NO PANO ")
    return;
  }

  const streetViewRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  let svPanoOptions: google.maps.StreetViewPanoramaOptions = {
    pano: currentPanorama.panoId,
    visible: true,
    addressControl: true,
    linksControl: true,
    fullscreenControl: false,
    enableCloseButton: false,
    showRoadLabels: false,
    imageDateControl: true,
  }
  useEffect(() => {
    console.log("svPanoOptions Effect", 'background: #222; color: #bada55')
    svPanoOptions = {
      ...svPanoOptions, 
      pov: {
        heading: currentPanorama.heading || 0,
        pitch: currentPanorama.pitch || 0,
      },
      zoom: currentPanorama.zoom || 1
    }
  }, [currentPanorama.localId]);

  useEffect(() => {
    
    if (!streetViewRef.current || !currentPanorama || !window.google || !window.google.maps) {
      return;
    }

    if (!panoramaRef.current) {
      panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, svPanoOptions);
      console.log("panoRef Effect", 'background: #222; color: #ff5555')
      panoramaRef.current.addListener('pov_changed', () => {
        const pov = panoramaRef.current?.getPov();
        const zoom = panoramaRef.current?.getZoom() || 1;
        if(pov && zoom) {
          //console.log("povCHanged")
          //console.warn(currentPanorama)
          //console.log(pov.heading)
          //updateCurrentPov(
          //  pov.heading || 0,
          //  pov.pitch || 0,
          //  zoom,
          //);
          setCurrentPanorama({...currentPanorama, heading: pov.heading, pitch: pov.pitch, zoom: zoom });
        }
        
      });
      panoramaRef.current.addListener('pano_changed', () => {
        const panoId = panoramaRef.current?.getPano();
        const pos = panoramaRef.current?.getPosition();
        if(panoId && pos?.lat() && pos?.lng()) {
          //updateCurrentPos(
          //  panoId,
          //  pos.lat(),
          //  pos.lng()
          //);
          setCurrentPanorama({...currentPanorama, panoId: panoId, lat: pos.lat(), lng: pos.lng() });
        }
        
      });
    } else if (panoramaRef.current.getPano() !== currentPanorama.panoId) {
      panoramaRef.current.setPano(currentPanorama.panoId);
    }
  }, [currentPanorama.localId, currentPanorama.panoId]);

  return <div ref={streetViewRef} className={className} />;
};

export default StreetViewViewer;
*/