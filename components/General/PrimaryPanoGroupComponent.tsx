import React, {useState} from 'react';
import PanoGroup from '@/components/General/SecondaryPanoGroupComponent';

import styles from '@/styles/PanoGrouping.module.css';
import { PrimaryPanoramaDataGroup } from '@/types/index';
interface PanoGroupingComponentProps {

  dataGroup: PrimaryPanoramaDataGroup
}
  
const PanoGroupingComponent: React.FC<PanoGroupingComponentProps> = ({ dataGroup }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(dataGroup.subGroups.length == 0)
    if(false) setIsDisabled(true);
  return (
    <div className={styles.primaryPanoGroup}>
        <div className={`${styles.primaryPanoGroupHeader} ${isDisabled ? styles.primaryPanoGroupHeaderDisabled : ''}`}>
            <button 
                  onClick={() => {
                      setIsOpen(!isOpen);
                  }}
                  disabled={isDisabled}
                  className={`${styles.primaryPanoGroupButton} ${isDisabled ? styles.primaryPanoGroupButtonDisabled : ''}`}
                >
                    <div>
                        <span>{dataGroup.value}</span>
                    </div>
            </button>
        </div>
        <div className={`
            ${styles.primaryPanoGroupDropdown} 
            ${
              isOpen ? styles.primaryPanoGroupDropdownOpen 
            : isDisabled ? styles.primaryPanoGroupDropdownDisabled 
            : ''
        }`}>
            { isOpen ? dataGroup.subGroups.map((group, index) =>
                <PanoGroup
                    key={index}
                    dataGroup={group}
                />
            )
            :
                <div>

                </div>
            }
        </div>
        
    </div>
  );
};

export default PanoGroupingComponent;
