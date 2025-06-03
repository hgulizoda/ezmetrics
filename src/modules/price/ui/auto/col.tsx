import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { IPrice } from '../../types/Price';
import Iconify from '../../../../components/iconify';

interface IProps {
  onDelete: (id: string) => void;
  t: TFunction;
  formatDateHour: any;
}

export const baseCol = ({ onDelete, t, formatDateHour }: IProps): GridColDef<IPrice>[] => {
  const lang = localStorage.getItem('i18nextLng');
  return [
    {
      headerName: t('prices.table.name'),
      field: 'nameUz',
      flex: 1,
      renderCell: ({ row }) => (
        <Link to={`/dashboard/prices/auto/${row.id}`} style={{ color: 'inherit' }}>
          {lang === 'ru' ? row.nameRu : row.nameUz}
        </Link>
      ),
    },
    {
      headerName: t('prices.table.createdDate'),
      field: 'createdAt',
      flex: 1,
      renderCell: ({ row }) => <Box>{formatDateHour(row.createdAt)}</Box>,
    },
    {
      headerName: t('prices.table.updatedDate'),
      field: 'updatedAt',
      flex: 1,
      renderCell: ({ row }) => <Box>{formatDateHour(row.updatedAt)}</Box>,
    },
    {
      type: 'actions',
      headerName: '',
      field: '',
      getActions: ({ row }) => [
        <GridActionsCellItem
          showInMenu
          sx={{ color: '#B71D18' }}
          icon={<Iconify icon="hugeicons:delete-01" />}
          label={t('actions.delete')}
          onClick={() => onDelete(row.id)}
        />,
      ],
    },
  ];
};
