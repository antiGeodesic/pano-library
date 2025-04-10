import React from 'react';

import { PanoramaData } from '@/types/index';
import styles from '@/styles/LocalEditor.module.css';
interface AddressDisplayProps {
    displayedPano: PanoramaData
}
const AddressDisplay: React.FC<AddressDisplayProps> = ({displayedPano}) => {

    const displayRegion = displayedPano.address.region != "";
    //const displaySubdivision = displayedPano.address.subdivision != "";
    const displayCountry = displayedPano.address.country != "";
    
    if (!displayedPano) return;
    return (
        <div className={styles.addressDisplay}>
            <span>{displayedPano.address.road}</span>
            <span>{`${displayRegion ? (displayedPano.address.region + ", ") : ''}` + displayedPano.address.subdivision + `${displayCountry ? (", " + displayedPano.address.country) : ''}`}</span>
        </div>
    )
    
};

export default AddressDisplay;