import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from '../../../../components/iconify';
import { ITruckAdapter } from '../../types/ChinaBorder';

interface IProps {
  action: (id: string) => void;
  t: TFunction;
  formatDate: any;
  back: (id: string) => void;
  from?: string;
}

export const baseColumns = ({
  action,
  t,
  formatDate,
  back,
  from,
}: IProps): GridColDef<ITruckAdapter>[] => [
  {
    field: 'name',
    headerName: t('packages.tableTitle.truckID'),
    flex: 1,
    renderCell: ({ row }) => (
      <Link style={{ color: 'inherit' }} to={`truck/${row.id}`} state={from ? { from } : undefined}>
        {row.name}
      </Link>
    ),
  },
  {
    field: 'containerNumber',
    headerName: t('transport.form.containerNumber'),
    flex: 1,
  },
  {
    field: 'ordersCount',
    headerName: t('packages.count'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.ordersCount)} </Box>,
  },
  {
    field: 'ordersWeight',
    headerName: t('packages.tableTitle.totalWeight'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.ordersWeight)} </Box>,
  },
  {
    field: 'orderCapacity',
    headerName: t('packages.tableTitle.totalCapacity'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.orderCapacity)} </Box>,
  },
  {
    field: 'createdAt',
    headerName: t('transport.form.truckCreatedDate'),
    flex: 1,
    renderCell: ({ row }) => formatDate(row.createdAt),
  },
  {
    field: 'estimatedDate',
    headerName: t('transport.form.truckEstimatedDate'),
    flex: 1,
    renderCell: ({ row }) => formatDate(row.estimatedDate),
  },
  {
    type: 'actions',
    field: 'action',
    headerName: '',
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="mdi:package-delivered" />}
        label={t('packages.status.delivered')}
        onClick={() => action(row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="material-symbols:settings-backup-restore" />}
        label={t('packages.actions.back')}
        onClick={() => back(row.id)}
      />,
    ],
  },
];
