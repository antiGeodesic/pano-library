// src/components/MovementHistoryPolyline.tsx

import React from 'react';

export const ArrowSvg: React.FC<{ heading: number | null | undefined, size?: number, rgb: { r: number, g: number, b: number } }> = ({ heading = 0, size = 24, rgb: { r = 1, g = 1, b = 1 } }) => {
    // Default heading to 0 if null/undefined
    const rotation = heading ?? 0;
    const rgbValue = "rgb(" + (r * 255).toString() + ", " + (g * 255).toString() + ", " + (b * 255).toString() + ")";
    return (
        <svg
            width={size}
            height={size}
            
            viewBox="0 0 540 540" // Viewbox defines the coordinate system 
            xmlns="http://www.w3.org/2000/svg"
            
            style={{
                // Apply rotation dynamically based on heading
                transform: `rotate(${rotation}deg)`,
                // Ensure rotation happens around the center
                transformOrigin: 'center center',
                // Optional: Add smooth transition if heading updates frequently
                // Prevent marker events from interfering with map clicks if needed
                pointerEvents: 'none',
                position:'absolute',
                left: `-${size / 2}px`,
                top: `-${size / 2}px`,
            }}>
            {/*
                  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 1080 1080"><circle r="35" stroke="red" stroke-width="5" transform="matrix(3.74 0 0 3.74 540 540)"/><path stroke="red" stroke-linejoin="round" stroke-width="25.668" d="M750.079 362.9006c18.4222-18.4223 18.4222-48.4569-.0073-66.8864L571.7335 117.676c-18.4296-18.4295-48.682-18.6473-67.333.0037L326.2839 295.7964c-18.4296 18.4295-18.4296 48.8997 0 67.3292 25.7076 23.8854 96.6705-28.8911 160.141-53.6804l-.0036 247.9399c.2287 17.5148 14.3349 31.621 31.621 31.621l47.7635.0072c17.297-.0109 31.3958-14.1098 31.3958-31.3959l.0037-245.2246c60.2798 25.7076 124.4327 72.5673 152.8738 50.5078z"/>
                  <circle r="36" stroke="red" stroke-width="2" transform="matrix(3.4 0 0 3.4 540 540)"/></svg>
<svg viewbox="0 0 1080 1080">     
    <g transform="matrix(1 0 0 1 540 540)"  >
        <g transform="matrix(3.74 0 0 3.74 0 0)"  >
            <circle stroke="rgb(255,0,0)" stroke-width="25" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" cx="0" cy="0" r="35" />
        </g>
        <g transform="matrix(-3.63 3.63 -3.63 -3.63 0 -185.06)"  >
            <path stroke="rgb(255,0,0)" stroke-width="25" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="round" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" transform=" translate(-50.5, -50)" d="M 22.66 19.967 C 17.585 19.967 13.448 24.104 13.448 29.180999999999997 L 13.448 78.31 C 13.448 83.387 17.585 87.584 22.723 87.584 L 71.791 87.584 C 76.868 87.584 81.065 83.387 81.065 78.31 C 80.814 71.479 63.769999999999996 68.974 51.613 63.646 L 85.765 29.494999999999997 C 88.146 27.051 88.146 23.165 85.765 20.784 L 79.187 14.203999999999999 C 76.803 11.822999999999999 72.919 11.822999999999999 70.538 14.203999999999999 L 36.76 47.981 C 31.998 36.137 29.616 20.846 22.66 19.967 z" />
        </g>
        <g transform="matrix(3.4 0 0 3.4 0 0)"  >
            <circle stroke="rgb(255,0,0)" stroke-width="0" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" vector-effect="non-scaling-stroke" cx="0" cy="0" r="35" />
        </g>
    </g>
</svg>
 
 
                
                */}


            {/*<g transform="matrix(1 0 0 1 540 540)"  >
                    
                    <g transform="matrix(3.74 0 0 3.74 0 0)"  >
                        <circle stroke={rgbValue} stroke-width="5" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" cx="0" cy="0" r="35" />
                    </g>
                    <g transform="matrix(-3.63 3.63 -3.63 -3.63 0 -185.06)"  >
                        <path stroke={rgbValue} stroke-width="5" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="round" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1" transform=" translate(-50.5, -50)" d="M 22.66 19.967 C 17.585 19.967 13.448 24.104 13.448 29.180999999999997 L 13.448 78.31 C 13.448 83.387 17.585 87.584 22.723 87.584 L 71.791 87.584 C 76.868 87.584 81.065 83.387 81.065 78.31 C 80.814 71.479 63.769999999999996 68.974 51.613 63.646 L 85.765 29.494999999999997 C 88.146 27.051 88.146 23.165 85.765 20.784 L 79.187 14.203999999999999 C 76.803 11.822999999999999 72.919 11.822999999999999 70.538 14.203999999999999 L 36.76 47.981 C 31.998 36.137 29.616 20.846 22.66 19.967 z" />
                    </g>
                    <g transform="matrix(3.4 0 0 3.4 0 0)"  >
                        <circle stroke={rgbValue} stroke-width="2" stroke-dasharray="none" stroke-linecap="butt" stroke-dashoffset="0" stroke-linejoin="miter" stroke-miterlimit="4" fill="rgb(0,0,0)" fill-rule="nonzero" opacity="1"  cx="0" cy="0" r="36" />
                    </g>


                
            </g>*/}

                {/*<path stroke={rgbValue} stroke-width="25" d="M200 270a70 70 0 1 1 140 0 70 70 0 1 1-140 0" />
                <path stroke={rgbValue} stroke-width="25" d="M375.0395 156.4503c9.2111-9.2111 9.2111-24.2284-.0037-33.4432l-89.169-89.1691c-9.2148-9.2148-24.341-9.3237-33.6665.0018l-89.0583 89.0584c-9.2148 9.2148-9.2148 24.4499 0 33.6646 12.8538 11.9427 48.3352-14.4456 80.0705-26.8402l-.0019 123.97c.1144 8.7573 7.1675 15.8104 15.8105 15.8104l23.8818.0036c8.6485-.0054 15.6979-7.0549 15.6979-15.6979l.0019-122.6123c30.1398 12.8538 62.2163 36.2836 76.4368 25.2539z" />
                <path stroke={rgbValue} stroke-width="25" d="M200 270a70 70 0 1 1 140 0 70 70 0 1 1-140 0" />*/}
                <path fill={rgbValue} stroke="black" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="round" d="M 300 205 L 300 120 L 350 160 C 380 130 350 100 350 100 L 285.867 33.838 C 281.259 29.231 275.174 26.9 269.075 26.886 C 262.976 26.873 256.863 29.177 252.2 33.84 L 190 100 C 190 100 160 130 190 160 L 240 120 L 240 205 L 235 209.5 C 188.3 236.4 188.3 303.8 235 330.7 C 256.7 343.2 283.3 343.2 305 330.7 C 351.7 303.8 351.7 236.4 305 209.5 L 300 205 Z"/>
        </svg>
    );
};

export const ArrowSvg2: React.FC = () => {
    // Default heading to 0 if null/undefined
    return (
        <svg
            width={540}
            height={540}
            
            viewBox="0 0 540 540" // Viewbox defines the coordinate system 
            xmlns="http://www.w3.org/2000/svg">

                <path fill='white' stroke="black" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="round" d="M 300 205 L 300 120 L 350 160 C 380 130 350 100 350 100 L 285.867 33.838 C 281.259 29.231 275.174 26.9 269.075 26.886 C 262.976 26.873 256.863 29.177 252.2 33.84 L 190 100 C 190 100 160 130 190 160 L 240 120 L 240 205 L 235 209.5 C 188.3 236.4 188.3 303.8 235 330.7 C 256.7 343.2 283.3 343.2 305 330.7 C 351.7 303.8 351.7 236.4 305 209.5 L 300 205 Z"/>
        </svg>
    );
};