import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { FeedbackItem, SuggestionEnum, SuggestionEnumLabels } from '../types/suggestions';

interface Props {
  onView: (item: FeedbackItem) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export const sugCol = ({ onView, onDelete, t }: Props): GridColDef<FeedbackItem>[] => [
  {
    headerName: t('feedbacks.table.fullName'),
    field: 'fullName',
    flex: 1,
  },
  {
    headerName: t('feedbacks.table.userId'),
    field: 'userId',
    flex: 1,
  },
  {
    headerName: t('feedbacks.table.phoneNumber'),
    field: 'phoneNumber',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.phoneNumber),
  },

  {
    headerName: t('feedbacks.table.type'),
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
    headerName: t('feedbacks.table.description'),
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
