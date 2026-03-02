import React from 'react';

interface WarningIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const WarningIcon: React.FC<WarningIconProps> = ({
  className = '',
  width = 80,
  height = 80,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M75.999 40C75.999 20.1177 59.8811 4 39.999 4C20.1168 4 3.99902 20.1177 3.99902 40C3.99902 59.8821 20.1168 76 39.999 76C59.8811 76 75.999 59.8821 75.999 40Z"
        fill="#ECEEF2"
      />
      <path
        d="M73.3337 40C73.3337 21.5905 58.4097 6.66669 40.0003 6.66669C21.5908 6.66669 6.66699 21.5905 6.66699 40C6.66699 58.4094 21.5908 73.3334 40.0003 73.3334C58.4097 73.3334 73.3337 58.4094 73.3337 40Z"
        fill="url(#paint0_linear_595_23793)"
      />
      <path
        d="M40 7.16669C58.1331 7.16669 72.8338 21.8665 72.834 39.9997C72.834 58.1329 58.1332 72.8337 40 72.8337C21.8668 72.8335 7.16699 58.1328 7.16699 39.9997C7.16717 21.8666 21.8669 7.16686 40 7.16669Z"
        stroke="white"
        strokeOpacity="0.5"
      />
      <g filter="url(#filter0_d_595_23793)">
        <path
          d="M38.9639 17.1361C36.6826 17.8639 35.5 21.4328 35.5 27.6329C35.5 29.8792 35.6889 32.2165 36.1718 35.8903C36.8226 40.9008 38.2991 49.5361 38.5721 49.977C38.88 50.4808 39.3208 50.7258 39.9086 50.7258C40.4965 50.7258 40.9373 50.4808 41.2452 49.977C41.5181 49.5361 42.9947 40.8868 43.6455 35.8903C44.1283 32.2235 44.3173 29.8792 44.3173 27.6329C44.3173 22.2306 43.4006 18.7526 41.6581 17.535C40.9093 17.0172 39.8457 16.8562 38.9639 17.1361Z"
          fill="white"
        />
      </g>
      <g filter="url(#filter1_d_595_23793)">
        <path
          d="M39.4891 54.2667C38.8103 54.3787 38.4744 54.4836 37.9566 54.7285C37.4947 54.9525 37.2498 55.1274 36.8229 55.5473C35.5913 56.7859 35.1994 58.5494 35.8012 60.1729C36.2421 61.3695 37.2848 62.3702 38.5444 62.8041C39.0272 62.972 39.2092 63 39.909 63C40.6087 63 40.7907 62.972 41.2735 62.8041C43.4779 62.0483 44.6955 59.844 44.1637 57.5837C43.8907 56.415 42.953 55.2464 41.8614 54.7285C41.5395 54.5746 41.1336 54.4206 40.9586 54.3787C40.5808 54.2877 39.734 54.2247 39.4891 54.2667Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_595_23793"
          x="32.02"
          y="14.6426"
          width="15.7774"
          height="40.6858"
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
          <feOffset dy="1.12258" />
          <feGaussianBlur stdDeviation="1.74" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.158654 0 0 0 0 0.113702 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_595_23793"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_595_23793"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_595_23793"
          x="32.0434"
          y="51.896"
          width="15.7246"
          height="15.7066"
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
          <feOffset dy="1.12258" />
          <feGaussianBlur stdDeviation="1.74" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.158654 0 0 0 0 0.113702 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_595_23793"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_595_23793"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_595_23793"
          x1="40.0003"
          y1="6.66669"
          x2="40.0003"
          y2="73.3334"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D54143" />
          <stop offset="1" stopColor="#7E1719" />
        </linearGradient>
      </defs>
    </svg>
  );
};

