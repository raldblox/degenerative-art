export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const LockIcon = () => (
  <>
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3M9 7a3 3 0 0 1 6 0v2H9Zm9 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"
      />
    </svg>
  </>
);

export const MetamaskIcon = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      viewBox="0 0 212 189"
      id="metamask"
    >
      <g fill="none" fillRule="evenodd">
        <polygon
          fill="#CDBDB2"
          points="60.75 173.25 88.313 180.563 88.313 171 90.563 168.75 106.313 168.75 106.313 180 106.313 187.875 89.438 187.875 68.625 178.875"
        ></polygon>
        <polygon
          fill="#CDBDB2"
          points="105.75 173.25 132.75 180.563 132.75 171 135 168.75 150.75 168.75 150.75 180 150.75 187.875 133.875 187.875 113.063 178.875"
          transform="matrix(-1 0 0 1 256.5 0)"
        ></polygon>
        <polygon
          fill="#393939"
          points="90.563 152.438 88.313 171 91.125 168.75 120.375 168.75 123.75 171 121.5 152.438 117 149.625 94.5 150.188"
        ></polygon>
        <polygon
          fill="#F89C35"
          points="75.375 27 88.875 58.5 95.063 150.188 117 150.188 123.75 58.5 136.125 27"
        ></polygon>
        <polygon
          fill="#F89D35"
          points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
        ></polygon>
        <polygon
          fill="#D87C30"
          points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
        ></polygon>
        <polygon
          fill="#EA8D3A"
          points="46.125 101.813 65.25 119.813 65.25 137.813"
        ></polygon>
        <polygon
          fill="#F89D35"
          points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
        ></polygon>
        <polygon
          fill="#EB8F35"
          points="65.25 138.375 60.75 173.25 90.563 152.438"
        ></polygon>
        <polygon
          fill="#EA8E3A"
          points="92.25 102.375 95.063 150.188 86.625 125.719"
        ></polygon>
        <polygon
          fill="#D87C30"
          points="39.375 138.938 65.25 138.375 60.75 173.25"
        ></polygon>
        <polygon
          fill="#EB8F35"
          points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
        ></polygon>
        <polygon
          fill="#E8821E"
          points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
        ></polygon>
        <polygon
          fill="#DFCEC3"
          points="60.75 173.25 90.563 152.438 88.313 170.438 88.313 180.563 68.063 176.625"
        ></polygon>
        <polygon
          fill="#DFCEC3"
          points="121.5 173.25 150.75 152.438 148.5 170.438 148.5 180.563 128.25 176.625"
          transform="matrix(-1 0 0 1 272.25 0)"
        ></polygon>
        <polygon
          fill="#393939"
          points="70.313 112.5 64.125 125.438 86.063 119.813"
          transform="matrix(-1 0 0 1 150.188 0)"
        ></polygon>
        <polygon
          fill="#E88F35"
          points="12.375 .563 88.875 58.5 75.938 27"
        ></polygon>
        <path
          fill="#8E5A30"
          d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
        ></path>
        <g transform="matrix(-1 0 0 1 211.5 0)">
          <polygon
            fill="#F89D35"
            points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
          ></polygon>
          <polygon
            fill="#D87C30"
            points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
          ></polygon>
          <polygon
            fill="#EA8D3A"
            points="46.125 101.813 65.25 119.813 65.25 137.813"
          ></polygon>
          <polygon
            fill="#F89D35"
            points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
          ></polygon>
          <polygon
            fill="#EB8F35"
            points="65.25 138.375 60.75 173.25 90 153"
          ></polygon>
          <polygon
            fill="#EA8E3A"
            points="92.25 102.375 95.063 150.188 86.625 125.719"
          ></polygon>
          <polygon
            fill="#D87C30"
            points="39.375 138.938 65.25 138.375 60.75 173.25"
          ></polygon>
          <polygon
            fill="#EB8F35"
            points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
          ></polygon>
          <polygon
            fill="#E8821E"
            points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
          ></polygon>
          <polygon
            fill="#393939"
            points="70.313 112.5 64.125 125.438 86.063 119.813"
            transform="matrix(-1 0 0 1 150.188 0)"
          ></polygon>
          <polygon
            fill="#E88F35"
            points="12.375 .563 88.875 58.5 75.938 27"
          ></polygon>
          <path
            fill="#8E5A30"
            d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
          ></path>
        </g>
      </g>
    </svg>
  </>
);

export const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="16"
    viewBox="0 0 32 32"
  >
    <path d="M 4.0175781 4 L 13.091797 17.609375 L 4.3359375 28 L 6.9511719 28 L 14.246094 19.34375 L 20.017578 28 L 20.552734 28 L 28.015625 28 L 18.712891 14.042969 L 27.175781 4 L 24.560547 4 L 17.558594 12.310547 L 12.017578 4 L 4.0175781 4 z M 7.7558594 6 L 10.947266 6 L 24.279297 26 L 21.087891 26 L 7.7558594 6 z"></path>
  </svg>
);
