import { Suspense } from 'react';
import { Outlet } from 'react-router';

const UsersLayout = () => (
  <Suspense>
    <Outlet />
  </Suspense>
);

export default UsersLayout;
