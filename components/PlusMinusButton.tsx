import React from 'react';
import styles from './PlusMinusButton.module.css';

interface PlusMinusButtonProps {
  isMinus: boolean;
  onClick: () => void;
}

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({ isMinus, onClick }) => {
  return (
    <div
  className={styles.plusMinus}
  onClick={onClick}
>

      <svg
  xmlns="http://www.w3.org/2000/svg"
  className={`${styles.svg} ${isMinus ? styles.svgMinus : ''}`}
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
          className={`${styles.horizontalLine} ${isMinus ? styles.horizontalLineRotated : ''}`}
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
