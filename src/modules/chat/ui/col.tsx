import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import Iconify from 'src/components/iconify';

import { ICustomerRes } from '../types/chat';

interface Props {
  unArchive: (id: string) => void;
  onDelete: (id: string) => void;
  viewMessages: (id: string) => void;
}

export const archiveChatColumn = ({
  unArchive,
  onDelete,
  viewMessages,
}: Props): GridColDef<ICustomerRes>[] => [
  {
    headerName: 'Mijoz ID',
    field: 'user_id',
    flex: 1,
    renderCell: ({ row }) => row.user?.user_id,
  },
  {
    headerName: 'F.I.SH',
    field: 'fullName',
    flex: 1,
    renderCell: ({ row }) => `${row.profile?.first_name} ${row.profile?.last_name}`,
  },
  {
    headerName: 'Kompaniya',
    field: 'company',
    flex: 1,
    renderCell: ({ row }) => row.profile?.company_name,
  },
  {
    headerName: 'Telefon raqami',
    field: 'phone_number',
    flex: 1,
    renderCell: ({ row }) => formatPhoneNumber(row.user?.phone_number),
  },
  {
    field: 'id',
    type: 'actions',
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        label="Arxivdan chiqarish"
        icon={<Iconify icon="hugeicons:archive-02" />}
        onClick={() => unArchive(row._id)}
      />,
      <GridActionsCellItem
        showInMenu
        sx={{
          color: (theme) => theme.palette.error.main,
        }}
        label="O'chirish"
        icon={<Iconify icon="hugeicons:delete-02" />}
        onClick={() => onDelete(row._id)}
      />,
      <GridActionsCellItem
        showInMenu
        sx={{
          color: (theme) => theme.palette.primary.main,
        }}
        label="Ko'rish"
        icon={<Iconify icon="hugeicons:view" />}
        onClick={() => viewMessages(row._id)}
      />,
    ],
  },
];
