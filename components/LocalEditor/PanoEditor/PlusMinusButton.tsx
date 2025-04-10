// components/PlusMinusButton.tsx
import React, { useEffect, useState } from 'react';
import styles from '@/components/LocalEditor/PanoEditor/PlusMinusButton.module.css';

interface Props {
  isMinus: boolean;
  onClick: () => void;
  disabled?: boolean; // <-- Add the optional disabled prop
  className?: string; // <-- Optional: Allow passing extra classes
  'aria-label'?: string; // <-- Optional: Allow passing aria-label
}

const PlusMinusButton: React.FC<Props> = ({
  isMinus,
  onClick,
  disabled = false, // Default to false if not provided
  className = '',
  'aria-label': ariaLabel // Destructure aria-label
}) => {
  const [animateMinus, setAnimateMinus] = useState(false);

  useEffect(() => {
    if (isMinus) {
      requestAnimationFrame(() => {
        setAnimateMinus(true);
      });
    } else {
      setAnimateMinus(false);
    }
  }, [isMinus]);

  // Combine base styles with any passed className and disabled state styles
  const buttonClasses = `
    ${styles.plusMinus}
    ${className}
    ${disabled ? styles.disabled : ''} // Add a disabled style class
  `;

  return (
    // Change the root element to a button
    <button
      type="button" // Explicitly set type to prevent potential form submission issues
      className={buttonClasses.trim()} // Use the combined classes
      onClick={onClick}
      disabled={disabled} // Pass the disabled prop to the button element
      aria-label={ariaLabel} // Pass the aria-label
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.svg} ${animateMinus ? styles.svgMinus : ''}`}
        viewBox="0 0 160 160"
        aria-hidden="true" // Hide decorative SVG from screen readers
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
    </button>
  );
};

export default PlusMinusButton;