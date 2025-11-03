import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Nexus Logistics - Dashboard Login</title>
        <meta name="description" content="Nexus Logistics Dashboard Login" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${import.meta.env.VITE_DASHBOARD_URL}/login`} />
      </Helmet>

      <JwtLoginView />
    </>
  );
}
