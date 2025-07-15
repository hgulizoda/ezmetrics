import { Button } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IOrderWithBonus } from '../../types/SingleUserBonus';

interface Props {
  onRemove: (id: string) => void;
  onView: (id: string) => void;
}

export const baseColumn = ({ onRemove, onView }: Props): GridColDef<IOrderWithBonus>[] => [
  {
    headerName: 'Order nomi',
    flex: 1,
    field: 'orderName',
    renderCell: ({ row }) => <Button onClick={() => onView(row.orderId)}>{row.orderName}</Button>,
  },
  {
    headerName: 'Ball',
    flex: 1,
    field: 'ball',
    renderCell: ({ row }) => fNumber(row.ball),
  },

  {
    headerName: 'Hajmi',
    flex: 1,
    field: 'capacity',
    renderCell: ({ row }) => fNumber(row.capacity),
  },
  {
    headerName: 'Og`irligi',
    flex: 1,
    field: 'weight',
    renderCell: ({ row }) => fNumber(row.weight),
  },
  {
    headerName: 'Qadoq',
    flex: 1,
    field: 'places',
    renderCell: ({ row }) => fNumber(row.places),
  },
  {
    headerName: 'Soni',
    flex: 1,
    field: 'count',
    renderCell: ({ row }) => fNumber(row.count),
  },
  {
    type: 'actions',
    field: 'id',
    getActions: ({ row }) => [
      <GridActionsCellItem
        label="O'chirish"
        onClick={() => onRemove(row.id)}
        showInMenu
        icon={<Iconify icon="hugeicons:delete-01" />}
      />,
    ],
  },
];
