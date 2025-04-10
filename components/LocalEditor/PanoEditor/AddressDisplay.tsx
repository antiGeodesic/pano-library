import React from 'react';

import { PanoramaData } from '@/types/index';
import styles from '@/styles/LocalEditor.module.css';
interface AddressDisplayProps {
    displayedPano: PanoramaData
}
const AddressDisplay: React.FC<AddressDisplayProps> = ({displayedPano}) => {


    if (!displayedPano) return;
    return (
        <div className={styles.addressDisplay}>
            <span>{displayedPano.address.road}</span>
            <span>{displayedPano.address.region + ", " + displayedPano.address.subdivision + ", " + displayedPano.address.country}</span>
        </div>
    )
    
};

export default AddressDisplay;