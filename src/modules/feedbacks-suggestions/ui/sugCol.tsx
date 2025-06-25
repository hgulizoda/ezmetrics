import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { FeedbackItem, SuggestionEnum, SuggestionEnumLabels } from '../types/suggestions';

interface Props {
  onView: (item: FeedbackItem) => void;
  onDelete: (id: string) => void;
}

export const sugCol = ({ onView, onDelete }: Props): GridColDef<FeedbackItem>[] => [
  {
    headerName: 'F.I.SH',
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: 'ID',
    field: 'userId',
    flex: 1,
  },
  {
    headerName: 'Telefon raqami',
    field: 'phoneNumber',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phoneNumber),
  },

  {
    headerName: 'Turi',
    field: 'type',
    flex: 1,
    renderCell: ({ row }) => (
      <Label
        color={
          // eslint-disable-next-line no-nested-ternary
          row.type === SuggestionEnum.COMPLAINT
            ? 'error'
            : row.type === SuggestionEnum.SUGGESTION
              ? 'success'
              : 'info'
        }
      >
        {SuggestionEnumLabels[row.type as SuggestionEnum]}
      </Label>
    ),
  },
  {
    headerName: 'Ma`lumot',
    field: 'description',
    flex: 1,
  },
  {
    field: 'id',
    type: 'actions',
    width: 100,
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
