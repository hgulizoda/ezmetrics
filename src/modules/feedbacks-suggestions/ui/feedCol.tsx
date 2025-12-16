import { Button, Rating } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ReviewItem, ReasonsStatus } from '../types/feedbacks';

interface Props {
  onView: (item: ReviewItem) => void;
  onDelete: (id: string) => void;
  orderView: (id: string) => void;
  t: (key: string) => string;
}

export const feedcols = ({ onView, onDelete, orderView, t }: Props): GridColDef<ReviewItem>[] => [
  {
    headerName: t('feedbacks.table.fullName'),
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: t('feedbacks.table.userId'),
    field: 'userId',
    width: 100,
  },
  {
    headerName: t('feedbacks.table.phone'),
    field: 'phoneNumber',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phoneNumber),
  },
  {
    headerName: t('feedbacks.table.rating'),
    field: 'rating',
    flex: 1,
    renderCell: ({ row }) => <Rating name="read-only" value={row.rating} readOnly />,
  },

  {
    headerName: t('feedbacks.table.comment'),
    field: 'comment',
    flex: 1,
  },
  {
    headerName: t('feedbacks.table.order'),
    field: 'order',
    flex: 1,
    renderCell: ({ row }) => (
      <Button onClick={() => orderView(row.orderId)}>{row.orderName}</Button>
    ),
  },
  {
    headerName: t('feedbacks.table.reasons'),
    field: 'reasons',
    flex: 1,
    renderCell: ({ row }) =>
      row.reasons.map((el) => (
        <Label key={el} color="default">
          {t(`feedbacks.reasons.${el}`)}
        </Label>
      )),
  },
  {
    field: 'id',
    type: 'actions',
    width: 50,
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:delete-02" />}
        label={t('feedbacks.actions.delete')}
        onClick={() => onDelete(row.id)}
        sx={{
          color: 'error.main',
        }}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:view" width={25} />}
        label={t('feedbacks.actions.view')}
        onClick={() => onView(row)}
        sx={{
          color: (theme) => theme.palette.info.dark,
        }}
      />,
    ],
  },
];
