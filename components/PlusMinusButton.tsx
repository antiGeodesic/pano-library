import React, { useEffect, useState } from 'react';
import styles from './PlusMinusButton.module.css';

interface Props {
  isMinus: boolean;
  onClick: () => void;
}

const PlusMinusButton: React.FC<Props> = ({ isMinus, onClick }) => {
  const [animateMinus, setAnimateMinus] = useState(false);

  useEffect(() => {
    // Trigger animation *after* mounting and state change
    if (isMinus) {
      requestAnimationFrame(() => {
        setAnimateMinus(true);
      });
    } else {
      setAnimateMinus(false);
    }
  }, [isMinus]);

  return (
    <div className={styles.plusMinus} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.svg} ${animateMinus ? styles.svgMinus : ''}`}
        viewBox="0 0 160 160"
      >
        <rect
          className={styles.verticalLine}
          x="70"
          y="25"
          width="20"
          height="110"
          rx="10"
          ry="10"
        />
        <rect
          className={`${styles.horizontalLine} ${
            animateMinus ? styles.horizontalLineRotated : ''
          }`}
          x="25"
          y="70"
          width="110"
          height="20"
          rx="10"
          ry="10"
        />
      </svg>
    </div>
  );
};

export default PlusMinusButton;
