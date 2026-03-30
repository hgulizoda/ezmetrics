import { m } from 'framer-motion';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Theme, SxProps } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RoleBasedGuard({ hasContent, roles, children, sx }: RoleBasedGuardProp) {
  const { user } = useAuthContext();

  if (typeof roles !== 'undefined' && !roles.includes(user?.role || '')) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          ...sx,
        }}
      >
        <Box>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Permission Denied
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to access this page
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <ForbiddenIllustration
              sx={{
                height: 260,
                my: { xs: 5, sm: 10 },
              }}
            />
          </m.div>
        </Box>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
