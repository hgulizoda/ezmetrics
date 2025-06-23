import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { LogoMain } from 'src/assets/icons/Logo';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false }) => {
  if (disabledLink) {
    return <LogoMain />;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      <Box width={189} height={26}>
        <LogoMain />
      </Box>
    </Link>
  );
});

export default Logo;
