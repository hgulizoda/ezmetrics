import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>EZ Metric - Login</title>
        <meta name="description" content="EZ Metric Dashboard Login" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${import.meta.env.VITE_DASHBOARD_URL}/login`} />
      </Helmet>

      <JwtLoginView />
    </>
  );
}
