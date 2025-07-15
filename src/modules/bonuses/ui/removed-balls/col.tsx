import { Button } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IRemovedBonusesRes } from '../../types/RemovedBonuss';

interface Props {
  onRestore: (id: string) => void;
  onView: (id: string) => void;
}

export const baseColumn = ({ onRestore, onView }: Props): GridColDef<IRemovedBonusesRes>[] => [
  {
    headerName: 'Order nomi',
    flex: 1,
    field: 'order.description',
    renderCell: ({ row }) => (
      <Button onClick={() => onView(row.order._id)}>{row.order.description}</Button>
    ),
  },
  {
    headerName: 'Ball',
    flex: 1,
    field: 'ball',
    renderCell: ({ row }) => fNumber(row.given_ball),
  },
  {
    headerName: 'Hajmi',
    flex: 1,
    field: 'order_capacity',
    renderCell: ({ row }) => fNumber(row.order.order_capacity),
  },
  {
    headerName: 'Og`irligi',
    flex: 1,
    field: 'order_weight',
    renderCell: ({ row }) => fNumber(row.order.order_weight),
  },
  {
    headerName: 'Qadoq',
    flex: 1,
    field: 'places',
    renderCell: ({ row }) => fNumber(row.order.total_places),
  },
  {
    headerName: 'Soni',
    flex: 1,
    field: 'count',
    renderCell: ({ row }) => fNumber(row.order.total_count),
  },
  {
    type: 'actions',
    field: 'id',
    getActions: ({ row }) => [
      <GridActionsCellItem
        label="Qaytarish"
        onClick={() => onRestore(row._id)}
        showInMenu
        icon={<Iconify icon="tabler:restore" />}
      />,
    ],
  },
];
