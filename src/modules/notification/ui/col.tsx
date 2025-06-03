import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import Iconify from 'src/components/iconify';

import { INotification } from '../types/Notification';

interface Props {
  onDelete: (id: string) => void;
  t: TFunction;
  formatDateHour: any;
}

export const baseColumn = ({ onDelete, t, formatDateHour }: Props): GridColDef<INotification>[] => [
  {
    headerName: t('notification.table.name'),
    field: 'title.uz',
    flex: 1,
    renderCell: ({ row }) => (
      <Link style={{ color: 'inherit' }} to={row.id}>
        {row.title.uz}
      </Link>
    ),
  },
  {
    headerName: t('notification.table.content'),
    field: 'body.uz',
    flex: 1,
    renderCell: ({ row }) => <Box dangerouslySetInnerHTML={{ __html: row.body.uz }} />,
  },
  {
    headerName: t('notification.table.created'),
    field: 'sendedDate',
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDateHour(row.sendedDate)}</Box>,
  },
  {
    headerName: t('notification.table.update'),
    field: 'updatedDate',
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDateHour(row.updatedDate)}</Box>,
  },
  {
    headerName: '',
    field: 'action',
    type: 'actions',
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        label={t('actions.delete')}
        sx={{ color: 'red' }}
        icon={<Iconify icon="hugeicons:delete-02" />}
        onClick={() => onDelete(row.id)}
      />,
    ],
  },
];
