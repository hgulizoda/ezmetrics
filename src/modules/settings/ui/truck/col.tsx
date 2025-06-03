import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import Iconify from 'src/components/iconify';

import { ITruck } from '../../types/truck';
import Label from '../../../../components/label';
import { TruckTypeIcons } from '../../libs/truckEnum';

interface Props {
  edit: (value: ITruck) => void;
  remove: (id: string) => void;
  archive: (id: string) => void;
  t: TFunction;
  truckLabels: any;
  formatDate: any;
}

export const baseColumns = ({
  edit,
  remove,
  archive,
  t,
  truckLabels,
  formatDate,
}: Props): GridColDef<ITruck>[] => [
  {
    headerName: t('transport.truckName'),
    field: 'truckName',
    flex: 1,
    renderCell: ({ row }) => (
      <Link to={row.id} style={{ color: 'inherit', textDecoration: 'none' }}>
        {row.truckName.toUpperCase()}
      </Link>
    ),
  },
  {
    headerName: t('transport.form.containerNumber'),
    field: 'containerNumber',
    flex: 1,
  },
  {
    headerName: t('transport.createdTime'),
    field: 'createdAt',
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDate(row.createdAt)}</Box>,
  },
  {
    headerName: t('transport.estimatedArrivalTime'),
    field: 'estimatedArrivalTime',
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDate(row.estimatedArrivalDate) || '-'}</Box>,
  },
  {
    headerName: t('transport.truckStatus'),
    field: 'status',
    flex: 1,
    renderCell: ({ row }) => (
      <>
        {TruckTypeIcons[row.status] === '' ? (
          <Label>{truckLabels[row.status]}</Label>
        ) : (
          <Label endIcon={<Iconify icon={TruckTypeIcons[row.status]} />}>
            {truckLabels[row.status]}
          </Label>
        )}
      </>
    ),
  },
  {
    field: 'actions',
    headerName: '',
    align: 'right',
    type: 'actions',
    maxWidth: 50,
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:edit-01" />}
        label={t('actions.edit')}
        onClick={() => edit(row)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:delete-02" />}
        label={t('actions.delete')}
        onClick={() => remove(row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:archive-02" />}
        label={t('actions.archive')}
        onClick={() => archive(row.id)}
      />,
    ],
  },
];
