import { useTheme } from '@mui/material';

export const PulseIcon = () => {
  const theme = useTheme();

  return (
    <svg width="35" height="35" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="20"
        cy="20"
        fill="none"
        r="10"
        stroke={theme.palette.warning.dark}
        strokeWidth="4"
      >
        <animate attributeName="r" from="8" to="20" dur="1s" begin="0s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="20" cy="20" fill={theme.palette.warning.dark} r="10" />
    </svg>
  );
};
