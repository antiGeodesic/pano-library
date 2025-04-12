import React, { useState } from 'react';

import styles from '@/styles/PanoGrouping.module.css';
import { SecondaryPanoramaDataGroup } from '@/types/index';
interface PanoGroupProps {
    dataGroup: SecondaryPanoramaDataGroup
}

const PanoGroup: React.FC<PanoGroupProps> = ({ dataGroup }) => {
    const [state, setState] = useState<number>(dataGroup.localIds.length == 0 ? -1 : 0);
    const toggleState = () => {
        if (dataGroup.localIds.length == 0 && state != -1) {
            setState(-1);
            return;
        }
        if (state == 1) setState(0);
        else setState(1);
    }
    return (
        <div className={styles.panoDataGroup}>
            <button
                className={styles.panoDataGroupButton}
                
                onClick={() => {
                    toggleState();
                }}>
                <div className={styles.panoDataGroupContent}>
                    <span className={styles.panoDataGroupContentCount}>
                        {dataGroup.localIds.length}
                    </span>
                    <span className={styles.panoDataGroupContentValue} style={{backgroundColor:dataGroup.color}}>
                        {dataGroup.value}
                    </span>
                    
                </div>
            </button>
        </div>
    );

}

export default PanoGroup