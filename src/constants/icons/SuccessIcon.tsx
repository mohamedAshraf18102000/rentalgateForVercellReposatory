import React from 'react';

interface SuccessIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  className = '',
  width = 40,
  height = 40,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1471_3780)">
        <g filter="url(#filter0_d_1471_3780)">
          <path
            d="M38 20C38 10.0589 29.941 2 20 2C10.0589 2 2 10.0589 2 20C2 29.941 10.0589 38 20 38C29.941 38 38 29.941 38 20Z"
            fill="#ECEEF2"
          />
          <path
            d="M20 2.26953C29.7919 2.26953 37.7305 10.208 37.7305 20C37.7305 29.7919 29.7919 37.7305 20 37.7305C10.208 37.7305 2.26953 29.7919 2.26953 20C2.26953 10.208 10.208 2.26953 20 2.26953Z"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="0.54"
          />
        </g>
        <path
          d="M36.6663 20.0007C36.6663 10.7959 29.2043 3.33398 19.9997 3.33398C10.7949 3.33398 3.33301 10.7959 3.33301 20.0007C3.33301 29.2053 10.7949 36.6673 19.9997 36.6673C29.2043 36.6673 36.6663 29.2053 36.6663 20.0007Z"
          fill="url(#paint0_linear_1471_3780)"
        />
        <path
          d="M20 3.58398C29.0664 3.58416 36.416 10.9344 36.416 20.001C36.4158 29.0673 29.0663 36.4168 20 36.417C10.9334 36.417 3.58318 29.0674 3.58301 20.001C3.58301 10.9343 10.9333 3.58398 20 3.58398Z"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="0.5"
        />
        <g filter="url(#filter1_d_1471_3780)">
          <path
            d="M12 21L17 26L28 14"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="crispEdges"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1471_3780"
          x="-2"
          y="-1"
          width="44"
          height="44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.346154 0 0 0 0 0.346154 0 0 0 0 0.346154 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1471_3780"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1471_3780"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_1471_3780"
          x="8.64"
          y="11.24"
          width="22.72"
          height="18.72"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.6" />
          <feGaussianBlur stdDeviation="0.93" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.158654 0 0 0 0 0.113702 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1471_3780"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1471_3780"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1471_3780"
          x1="19.9997"
          y1="3.33398"
          x2="19.9997"
          y2="36.6673"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41D5A9" />
          <stop offset="1" stopColor="#177E64" />
        </linearGradient>
        <clipPath id="clip0_1471_3780">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

