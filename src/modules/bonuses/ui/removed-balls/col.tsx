import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IRemovedBonuses } from '../../types/RemovedBonuss';

interface Props {
  onRestore: (id: string) => void;
}

export const baseColumn = ({ onRestore }: Props): GridColDef<IRemovedBonuses>[] => [
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
        label="Qaytarish"
        onClick={() => onRestore(row.id)}
        showInMenu
        icon={<Iconify icon="tabler:restore" />}
      />,
    ],
  },
];
