import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import LocalPanoListItem from '@/components/LocalEditor/PanoEditor/LocalPanoList/LocalPanoListItem';
import styles from '@/styles/LocalEditor.module.css';

import { PanoramaData, TagCategory } from '@/types/index';
import carMeta from '@/data/Car-Meta.pano.json'
const LocalPanoList: React.FC = () => {
  const { localPanos, setLocalPanoList } = useLocalEditorContext();
  const extraTagsToTagCategory = (tags: string[] | null): TagCategory[] => {
    if(!tags) return [];
    return tags.map(tag => ({x: -1, y: -1, z: -1, t: tag} as TagCategory))
  }
  function activatePanos() {
    btnStyle = {width:'10rem', height:'4rem', backgroundColor: 'blue', color:'white'};
    btnConent = "Clicked"
    console.warn(btnConent)
    const newLPs = carMeta.customCoordinates.map(car => {const newLP: PanoramaData = {
      gen: "gen4",
      localId: crypto.randomUUID(), // A unique identifier for local storage
      panoId: car.panoId,
      lat: car.lat,
      lng: car.lng,
      heading: car.heading,
      pitch: car.pitch,
      zoom: car.zoom ?? 1,
      date: car.extra?.panoDate ?? "",
      address: {country: "Kazakhstan", subdivision: "", region: "", road: ""},
      availableDates: [],
      description: "",
      tags: extraTagsToTagCategory(car.extra?.tags ?? null),
      movementHistory: []
  }; return newLP});
  setLocalPanoList(newLPs)
  }
  let btnStyle = {width:'10rem', height:'4rem', backgroundColor: 'red', color:'white'}
  let btnConent = "Click Click Click"
  if (!localPanos || localPanos.length === 0) {
    return (
        <div className={styles.localPanoList}>
             <p className={styles.savedPanoEmpty}>
               Click on the map to find a Street View location and save it here.
             </p>
             <button style={btnStyle} onClick={() => activatePanos()}>
              {btnConent}
             </button>
        </div>
    );
  }

  return (
    <div className={styles.localPanoList}>
        <h2 className={styles.panoListHeader}>Locally Saved Panoramas</h2>
        <div className={styles.savedPanoList}>
        {localPanos.map((localPano, index) => index < 20 && (
            <LocalPanoListItem
            key={localPano.localId}
            localPano={localPano}
            />
        ))}
        </div>
    </div>
  );
};

export default LocalPanoList;
