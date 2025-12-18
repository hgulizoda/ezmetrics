import { Button } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IOrderWithBonus } from '../../types/SingleUserBonus';

interface Props {
  onRemove: (id: string) => void;
  onView: (id: string) => void;
  t: (key: string) => string;
}

export const baseColumn = ({ onRemove, onView, t }: Props): GridColDef<IOrderWithBonus>[] => [
  {
    headerName: t('bonus.singleUser.orderName'),
    flex: 1,
    field: 'orderName',
    renderCell: ({ row }) => <Button onClick={() => onView(row.orderId)}>{row.orderName}</Button>,
  },
  {
    headerName: t('bonus.table.ball'),
    flex: 1,
    field: 'ball',
    renderCell: ({ row }) => fNumber(row.ball),
  },

  {
    headerName: t('bonus.table.capacity'),
    flex: 1,
    field: 'capacity',
    renderCell: ({ row }) => fNumber(row.capacity),
  },
  {
    headerName: t('bonus.table.weight'),
    flex: 1,
    field: 'weight',
    renderCell: ({ row }) => fNumber(row.weight),
  },
  {
    headerName: t('bonus.singleUser.places'),
    flex: 1,
    field: 'places',
    renderCell: ({ row }) => fNumber(row.places),
  },
  {
    headerName: t('bonus.singleUser.count'),
    flex: 1,
    field: 'count',
    renderCell: ({ row }) => fNumber(row.count),
  },
  {
    type: 'actions',
    field: 'id',
    getActions: ({ row }) => [
      <GridActionsCellItem
        label={t('actions.delete')}
        onClick={() => onRemove(row.id)}
        showInMenu
        icon={<Iconify icon="hugeicons:delete-01" />}
      />,
    ],
  },
];
