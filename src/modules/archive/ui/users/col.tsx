import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { UserStatusLabelsColor } from 'src/types/UserStatus';

import { IUser } from '../../../user/types/User';

interface Props {
  unarchive: (id: string) => void;
  onDeleteUser: (id: string) => void;
  isMultiple: boolean;
  t: TFunction;
  userStatus: any;
}

export const baseColumns = ({
  unarchive,
  onDeleteUser,
  isMultiple,
  t,
  userStatus,
}: Props): GridColDef<IUser>[] => [
  {
    field: 'fullName',
    headerName: t('users.table.fullName'),
    flex: 1,
    renderCell: ({ row }) => (
      <Link to={`${paths.dashboard.users}/${row.id}`} style={{ color: 'inherit' }}>
        {row.fullName}
      </Link>
    ),
  },
  { field: 'customerId', headerName: t('users.table.clientID'), flex: 1 },
  {
    field: 'phone',
    headerName: t('users.table.phone'),
    flex: 1,
    renderCell: ({ row }) => <Box>{formatPhoneNumber(row.phone)}</Box>,
  },
  { field: 'company', headerName: t('users.table.company'), flex: 1 },
  {
    field: 'orders',
    headerName: t('users.table.orders'),
    flex: 1,
  },
  {
    field: 'status',
    headerName: t('users.table.status'),
    flex: 1,
    renderCell: ({ row }) => (
      <Label color={UserStatusLabelsColor[row.status]}>{userStatus[row.status]}</Label>
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: '',
    width: 50,
    getActions: ({ row }) => {
      if (!isMultiple) {
        return [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="ri:reset-left-line" />}
            label={t('archive.takeArchive')}
            onClick={() => unarchive(row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="hugeicons:delete-01" color="#FF4D4D" />}
            label={t('actions.delete')}
            sx={{ color: '#FF4D4D' }}
            onClick={() => onDeleteUser(row.id)}
          />,
        ];
      }
      return [];
    },
  },
];
