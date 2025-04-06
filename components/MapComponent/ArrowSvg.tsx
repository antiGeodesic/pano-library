// src/components/MovementHistoryPolyline.tsx

import React from 'react';

export const ArrowSvg: React.FC<{ heading: number | null | undefined, size?: number, rgb: {r: number, g: number, b: number} }> = ({ heading = 0, size = 24, rgb: {r = 1, g = 1, b = 1}}) => {
    // Default heading to 0 if null/undefined
    const rotation = heading ?? 0;
    const rgbValue = "rgb(" + (r * 255).toString() + ", " + (g * 255).toString() + ", " + (b * 255).toString() + ")" ;
    return (
        <svg 
            width={size}
            height={size}
            
            viewBox="0 0 24 24" // Viewbox defines the coordinate system viewbox="0 0 1080 1080"
            fill="#28a745" // Green color (similar to default green marker)
            xmlns="http://www.w3.org/2000/svg"
            style={{
                // Apply rotation dynamically based on heading
                transform: `rotate(${rotation}deg)`,
                // Ensure rotation happens around the center
                transformOrigin: 'center center',
                 // Optional: Add smooth transition if heading updates frequently
                 transition: 'transform 0.15s linear',
                 // Prevent marker events from interfering with map clicks if needed
                 pointerEvents: 'none',
            }}>

            <g transform="matrix(1 0 0 1 540 540)"  >
                <g  vector-effect="non-scaling-stroke"   >
                    <g transform="matrix(3.74 0 0 3.74 0 0)"  >
                        <circle stroke={rgbValue} stroke-width="25" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" cx="0" cy="0" r="35" />
                    </g>
                    <g transform="matrix(-3.63 3.63 -3.63 -3.63 0 -185.06)"  >
                        <path stroke={rgbValue} stroke-width="25" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="round" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" transform=" translate(-50.5, -50)" d="M 22.66 19.967 C 17.585 19.967 13.448 24.104 13.448 29.180999999999997 L 13.448 78.31 C 13.448 83.387 17.585 87.584 22.723 87.584 L 71.791 87.584 C 76.868 87.584 81.065 83.387 81.065 78.31 C 80.814 71.479 63.769999999999996 68.974 51.613 63.646 L 85.765 29.494999999999997 C 88.146 27.051 88.146 23.165 85.765 20.784 L 79.187 14.203999999999999 C 76.803 11.822999999999999 72.919 11.822999999999999 70.538 14.203999999999999 L 36.76 47.981 C 31.998 36.137 29.616 20.846 22.66 19.967 z" />
                    </g>
                    <g transform="matrix(3.4 0 0 3.4 0 0)"  >
                        <circle stroke={rgbValue} stroke-width="0" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" cx="0" cy="0" r="35" />
                    </g>


                </g>
            </g>
 
        </svg>
    );
};