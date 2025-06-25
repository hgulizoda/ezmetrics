import { Rating } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import {
  ReviewItem,
  PositiveReasonLabels,
  NegativeReasonLabels,
  PositiveReasonsStatus,
  NegativeReasonsStatus,
} from '../types/feedbacks';

interface Props {
  onView: (item: ReviewItem) => void;
  onDelete: (id: string) => void;
}

export const feedcols = ({ onView, onDelete }: Props): GridColDef<ReviewItem>[] => [
  {
    headerName: 'F.I.SH',
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: 'ID',
    field: 'userId',
    width: 100,
  },
  {
    headerName: 'Telefon',
    field: 'phoneNumber',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phoneNumber),
  },
  {
    headerName: 'Reyting',
    field: 'rating',
    flex: 1,
    renderCell: ({ row }) => <Rating name="read-only" value={row.rating} readOnly />,
  },

  {
    headerName: 'Komentariya',
    field: 'comment',
    flex: 1,
  },
  {
    headerName: 'Yaxshi sabablar',
    field: 'positiveReasons',
    flex: 1,
    renderCell: ({ row }) =>
      row.positiveReasons.map((el) => (
        <Label color="success">{PositiveReasonLabels[el as PositiveReasonsStatus]}</Label>
      )),
  },
  {
    headerName: 'Yomon sabablar',
    field: 'negativeReasons',
    flex: 1,
    renderCell: ({ row }) =>
      row.negativeReasons.map((el) => (
        <Label color="error">{NegativeReasonLabels[el as NegativeReasonsStatus]}</Label>
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
        label="O'chirish"
        onClick={() => onDelete(row.id)}
        sx={{
          color: 'error.main',
        }}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:view" width={25} />}
        label="Ko'rish"
        onClick={() => onView(row)}
        sx={{
          color: (theme) => theme.palette.info.dark,
        }}
      />,
    ],
  },
];
