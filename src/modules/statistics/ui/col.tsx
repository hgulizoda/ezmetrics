import { GridColDef } from '@mui/x-data-grid';

import { IStat } from '../types/Stats';

export const column = (): GridColDef<IStat>[] => [
  {
    headerName: 'F.I.O',
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: 'Foydalanuvchi ID',
    field: 'userId',
    flex: 1,
  },
  {
    headerName: 'Telefon',
    field: 'phone',
    flex: 1,
  },
  {
    headerName: 'Tashkilot',
    field: 'company',
    flex: 1,
  },
  {
    headerName: 'Barcha buyurtmalar',
    field: 'totalOrders',
    flex: 1,
  },
  {
    headerName: "Umumiy og'irlik",
    field: 'totalWeight',
    flex: 1,
  },
  {
    headerName: 'Umumiy hajm',
    field: 'totalCapacity',
    flex: 1,
  },
  {
    headerName: 'Umumiy joy',
    field: 'totalPlaces',
    flex: 1,
  },
];
