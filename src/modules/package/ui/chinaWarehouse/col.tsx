import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IChinaWarehouse } from '../../types/ChinaWarehouse';

interface Props {
  cellClick: (id: string, userId: string, clientId: string) => void;
  onViewOrder: (id: string) => void;
  isMultiple: boolean;
  onArchive: (id: string) => void;
  edit: (id: string) => void;
  separate: (id: string) => void;
  t: TFunction;
  formatDate: any;
}

export const baseColumns = ({
  cellClick,
  onViewOrder,
  isMultiple,
  onArchive,
  edit,
  separate,
  t,
  formatDate,
}: Props): GridColDef<IChinaWarehouse>[] => [
  {
    field: 'fullName',
    headerName: t('packages.tableTitle.fullName'),
    width: 200,
    renderCell: ({ row }) => (
      <Link to={`${paths.dashboard.users}/${row.userId}`} style={{ color: 'inherit' }}>
        {row.fullName}
      </Link>
    ),
  },
  {
    field: 'clientId',
    headerName: t('packages.tableTitle.clientID'),
    width: 150,
  },

  {
    field: 'totalPlaces',
    headerName: t('packages.tableTitle.packageNumber'),
    renderCell: ({ row }) => <Box>{fNumber(row.totalPlaces)}</Box>,
    width: 150,
  },
  {
    field: 'totalCount',
    headerName: t('packages.tableTitle.stockNumber'),
    renderCell: ({ row }) => <Box>{fNumber(row.totalCount)}</Box>,
    width: 150,
  },
  {
    field: 'packageCapacity',
    headerName: t('packages.tableTitle.capacity'),
    renderCell: ({ row }) => <Box>{fNumber(row.packageCapacity)}</Box>,
    width: 150,
  },
  {
    field: 'packageWeight',
    headerName: t('packages.tableTitle.weight'),
    renderCell: ({ row }) => <Box>{fNumber(row.packageWeight)}</Box>,
    width: 150,
  },
  {
    field: 'description',
    headerName: t('packages.tableTitle.description'),
    renderCell: ({ row }) => <Button onClick={() => onViewOrder(row.id)}>{row.description}</Button>,
    width: 150,
  },
  {
    field: 'packageDate',
    headerName: t('packages.tableTitle.sendedDate'),
    renderCell: ({ row }) => <Box>{formatDate(row.packageDate)}</Box>,
    width: 150,
  },
  {
    field: 'statusUpdate',
    headerName: t('packages.tableTitle.updatedDate'),
    renderCell: ({ row }) => <Box>{formatDate(row.statusUpdate)}</Box>,
    width: 150,
  },
  {
    field: 'actions',
    headerName: '',
    align: 'right',
    type: 'actions',
    maxWidth: 50,
    getActions: ({ row }) => {
      if (!isMultiple) {
        return [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="material-symbols:delivery-truck-speed-rounded" />}
            label={t('packages.status.chinaBorder')}
            onClick={() => cellClick(row.id, row.userId, row.clientId)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="material-symbols:archive" />}
            label={t('actions.archive')}
            onClick={() => onArchive(row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="material-symbols:edit" />}
            label={t('actions.edit')}
            onClick={() => edit(row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="lucide:separator-horizontal" />}
            label={t('packages.actions.partial')}
            onClick={() => separate(row.id)}
          />,
        ];
      }
      return [];
    },
  },
];
