import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Iconify from '../../../components/iconify';
import { IBonusesList } from '../types/BunusesList';
import { statusColor, statusLabel } from '../libs/statusLabel';

interface Props {
  t: TFunction;
  handleUpdateStatus: (bonus_id: string, user_id: string) => Promise<void>;
}

export const baseColumns = ({ t, handleUpdateStatus }: Props): GridColDef<IBonusesList>[] => [
  {
    field: 'fullName',
    headerName: t('users.table.fullName'),
    flex: 1,
    renderCell: ({ row }) => (
      <Link to={`${paths.dashboard.users}/${row.user._id}`} style={{ color: 'inherit' }}>
        {row.profile.first_name} {row.profile.last_name}
      </Link>
    ),
  },
  {
    field: 'customerId',
    headerName: t('users.table.clientID'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.user.user_id}</Box>,
  },
  {
    field: 'company',
    headerName: t('users.table.company'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.profile.company_name}</Box>,
  },

  {
    field: 'phone',
    headerName: t('users.table.phone'),
    flex: 1,
    renderCell: ({ row }) => <Box>{formatPhoneNumber(row.user.phone_number)}</Box>,
  },
  {
    field: 'ball',
    headerName: t('bonus.table.ball'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.ball}</Box>,
  },
  {
    field: 'status',
    headerName: t('bonus.table.status'),
    flex: 1,
    renderCell: ({ row }) => (
      <Chip label={statusLabel(t)[row.status]} color={statusColor[row.status]} variant="soft" />
    ),
  },
  {
    field: 'total_capacity',
    headerName: t('bonus.table.capacity'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.total_capacity}</Box>,
  },
  {
    field: 'total_weight',
    headerName: t('bonus.table.weight'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.total_weight}</Box>,
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: '',
    flex: 1,
    maxWidth: 60,
    getActions: ({ row }) => {
      if (row.status === 'not_used') {
        return [
          <GridActionsCellItem
            showInMenu
            key={row._id}
            icon={<Iconify icon="material-symbols:check" />}
            label="Check"
            onClick={() => handleUpdateStatus(row._id, row.user._id)}
          />,
        ];
      }
      return [];
    },
  },
];
