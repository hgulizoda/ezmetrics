import UsersTableLayout from 'src/layouts/users';
import Users from 'src/pages/dashboard/users/users';
import { UserDetailLayout } from 'src/layouts/userDetailLayout';
import UserOrders from 'src/modules/user/ui/userOrders/UserOrders';
import UserPackages from 'src/modules/package/ui/userPackages/UserPackages';
import UserInformation from 'src/modules/user/ui/userInformation/UserInformation';

import BonusesProfileView from '../../modules/bonuses/ui/profile/ProfileTabel';

// ----------------------------------------------------------------------

export const usersRoutes = [
  {
    path: 'users',
    element: <UsersTableLayout />,
    children: [
      { element: <Users />, index: true },
      {
        path: ':id',
        element: <UserDetailLayout />,
        children: [
          { element: <UserInformation />, index: true },
          {
            element: <UserOrders />,
            path: 'orders',
            children: [
              { element: <UserPackages />, index: true },
              { element: <UserPackages />, path: ':status' },
            ],
          },
          {
            element: <BonusesProfileView />,
            path: 'bonus',
          },
        ],
      },
    ],
  },
];
