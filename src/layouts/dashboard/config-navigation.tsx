import { useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

export function useNavData() {
  return useMemo(
    () => [
      {
        subheader: 'Overview',
        roles: [],
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: <Iconify icon="solar:chart-bold-duotone" width={24} />,
          },
          {
            title: 'Workers',
            path: paths.dashboard.workers,
            icon: <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />,
          },
        ],
      },
      {
        subheader: 'Time Tracking',
        roles: [],
        items: [
          {
            title: 'Clock In/Out',
            path: paths.dashboard.clock,
            icon: <Iconify icon="solar:clock-circle-bold-duotone" width={24} />,
          },
          {
            title: 'Shifts',
            path: paths.dashboard.shifts,
            icon: <Iconify icon="solar:calendar-bold-duotone" width={24} />,
          },
        ],
      },
      {
        subheader: 'Payroll',
        roles: [],
        items: [
          {
            title: 'Efficiency',
            path: paths.dashboard.efficiency,
            icon: <Iconify icon="solar:chart-2-bold-duotone" width={24} />,
          },
          {
            title: 'Bonus Rules',
            path: paths.dashboard.bonusRules,
            icon: <Iconify icon="solar:gift-bold-duotone" width={24} />,
          },
          {
            title: 'Salary',
            path: paths.dashboard.salary,
            icon: <Iconify icon="solar:wallet-money-bold-duotone" width={24} />,
          },
        ],
      },
      {
        subheader: 'Analytics',
        roles: [],
        items: [
          {
            title: 'Reports',
            path: paths.dashboard.reports,
            icon: <Iconify icon="solar:document-bold-duotone" width={24} />,
          },
          {
            title: 'Progress',
            path: paths.dashboard.progress,
            icon: <Iconify icon="solar:graph-up-bold-duotone" width={24} />,
          },
        ],
      },
      {
        subheader: 'Admin',
        roles: [],
        items: [
          {
            title: 'Settings',
            path: paths.dashboard.settings,
            icon: <Iconify icon="solar:settings-bold-duotone" width={24} />,
          },
        ],
      },
    ],
    []
  );
}
