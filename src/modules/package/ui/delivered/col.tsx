import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { IResiduePackage } from '../../types/ResiduePackage';

interface Props {
  archive: (id: string) => void;
  isMultiple: boolean;
  onViewOrder: (id: string) => void;
  back: (id: string, userID: string) => void;
  t: TFunction;
}

export const baseColumns = ({
  archive,
  isMultiple,
  onViewOrder,
  back,
  t,
}: Props): GridColDef<IResiduePackage>[] => [
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
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.totalPlaces)}</Box>,
  },
  {
    field: 'totalCount',
    headerName: t('packages.tableTitle.stockNumber'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.totalCount)}</Box>,
  },
  {
    field: 'packageCapacity',
    headerName: t('packages.tableTitle.capacity'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.packageCapacity)}</Box>,
  },
  {
    field: 'packageWeight',
    headerName: t('packages.tableTitle.weight'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.packageWeight)}</Box>,
  },
  {
    field: 'truck',
    headerName: t('packages.tableTitle.truck'),
    width: 200,
  },
  {
    field: 'containerNumber',
    headerName: t('transport.form.containerNumber'),
    width: 150,
    renderCell: ({ row }) => <Box>{row.containerNumber}</Box>,
  },
  {
    field: 'description',
    headerName: t('packages.tableTitle.description'),
    width: 250,
    renderCell: ({ row }) => <Button onClick={() => onViewOrder(row.id)}>{row.description}</Button>,
  },
  {
    field: 'actions',
    headerName: '',
    type: 'actions',
    maxWidth: 50,
    getActions: ({ row }) => {
      if (isMultiple) {
        return [];
      }
      return [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="material-symbols:archive" />}
          label={t('actions.archive')}
          onClick={() => archive(row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="material-symbols:settings-backup-restore" />}
          label={t('packages.actions.back')}
          onClick={() => back(row.id, row.userId)}
        />,
      ];
    },
  },
];
