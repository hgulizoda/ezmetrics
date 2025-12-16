import { TFunction } from 'i18next';

import { GridColDef } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import { IStat } from '../types/Stats';

export const column = (t: TFunction): GridColDef<IStat>[] => [
  {
    headerName: t('statistics.table.fullName'),
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: t('statistics.table.userId'),
    field: 'userId',
    flex: 1,
  },
  {
    headerName: t('statistics.table.phone'),
    field: 'phone',
    flex: 1,
  },
  {
    headerName: t('statistics.table.company'),
    field: 'company',
    flex: 1,
  },
  {
    headerName: t('statistics.table.totalOrders'),
    field: 'totalOrders',
    flex: 1,
  },
  {
    headerName: t('statistics.table.totalWeight'),
    field: 'totalWeight',
    flex: 1,
    renderCell: ({ row }) => fNumber(row.totalWeight),
  },
  {
    headerName: t('statistics.table.totalCapacity'),
    field: 'totalCapacity',
    flex: 1,
    renderCell: ({ row }) => fNumber(row.totalCapacity),
  },
  {
    headerName: t('statistics.table.totalPlaces'),
    field: 'totalPlaces',
    flex: 1,
    renderCell: ({ row }) => fNumber(row.totalPlaces),
  },
];
