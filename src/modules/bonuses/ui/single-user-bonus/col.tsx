import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IOrderWithBonus } from '../../types/SingleUserBonus';

interface Props {
  onRemove: (id: string) => void;
}

export const baseColumn = ({ onRemove }: Props): GridColDef<IOrderWithBonus>[] => [
  {
    headerName: 'Order ID',
    flex: 1,
    field: 'orderId',
  },
  {
    headerName: 'Order nomi',
    flex: 1,
    field: 'orderName',
  },
  {
    headerName: 'Ball',
    flex: 1,
    field: 'ball',
    renderCell: ({ row }) => fNumber(row.ball),
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
