import { Link, Stack, Button, Container, IconButton, useMediaQuery } from '@mui/material';

import SvgColor from '../svg-color';
import Logo from '../../assets/images/Logo3.svg';

export default function Navbar() {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <Container component="nav" maxWidth="lg">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={isMobile ? 1 : 2}
        height="90px"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {isMobile && (
            <IconButton>
              <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
            </IconButton>
          )}
          <img src={Logo} width={isMobile ? 180 : 250} height={isMobile ? 34 : 34} alt="Logo" />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={isMobile ? 2 : 8}>
          {!isMobile && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link href="/" variant="body2" color="inherit" fontSize={16}>
                Bizning imkoniyatlarimiz
              </Link>
              <Link href="/" variant="body2" color="inherit" fontSize={16}>
                Bizning takliflarimiz
              </Link>
              <Link href="/" variant="body2" color="inherit" fontSize={16}>
                Sharhlar
              </Link>
              <Link href="/" variant="body2" color="inherit" fontSize={16}>
                Yordam
              </Link>
            </Stack>
          )}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant={!isMobile ? 'soft' : 'contained'}
              sx={{ borderRadius: 3, padding: '0 24px', fontSize: 16, fontWeight: 600 }}
              size="large"
              color="success"
            >
              Login
            </Button>
            {!isMobile && (
              <Button
                variant="contained"
                sx={{ borderRadius: 3, padding: '0 24px', fontSize: 16, fontWeight: 600 }}
                size="large"
                color="success"
              >
                Sign up
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
