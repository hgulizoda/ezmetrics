import { Button } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { TFunction } from 'i18next';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IRemovedBonusesRes } from '../../types/RemovedBonuss';

interface Props {
  onRestore: (id: string) => void;
  onView: (id: string) => void;
  t: TFunction;
}

export const baseColumn = ({ onRestore, onView, t }: Props): GridColDef<IRemovedBonusesRes>[] => [
  {
    headerName: t('bonus.removedBalls.orderName'),
    flex: 1,
    field: 'order.description',
    renderCell: ({ row }) => (
      <Button onClick={() => onView(row.order._id)}>{row.order.description}</Button>
    ),
  },
  {
    headerName: t('bonus.table.ball'),
    flex: 1,
    field: 'ball',
    renderCell: ({ row }) => fNumber(row.given_ball),
  },
  {
    headerName: t('bonus.table.capacity'),
    flex: 1,
    field: 'order_capacity',
    renderCell: ({ row }) => fNumber(row.order.order_capacity),
  },
  {
    headerName: t('bonus.table.weight'),
    flex: 1,
    field: 'order_weight',
    renderCell: ({ row }) => fNumber(row.order.order_weight),
  },
  {
    headerName: t('bonus.singleUser.places'),
    flex: 1,
    field: 'places',
    renderCell: ({ row }) => fNumber(row.order.total_places),
  },
  {
    headerName: t('bonus.singleUser.count'),
    flex: 1,
    field: 'count',
    renderCell: ({ row }) => fNumber(row.order.total_count),
  },
  {
    type: 'actions',
    field: 'id',
    getActions: ({ row }) => [
      <GridActionsCellItem
        label={t('bonus.removedBalls.restore')}
        onClick={() => onRestore(row._id)}
        showInMenu
        icon={<Iconify icon="tabler:restore" />}
      />,
    ],
  },
];
