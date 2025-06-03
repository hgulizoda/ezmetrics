import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import Iconify from '../../../../components/iconify';

interface Props {
  cellClick: (id: string) => void;
  isMultiple: boolean;
  unarchive: (id: string) => void;
  t: TFunction;
}

export const baseColumns = ({ cellClick, unarchive, isMultiple, t }: Props): GridColDef[] => [
  {
    headerName: t('transport.truckName'),
    field: 'name',
    flex: 1,
    renderCell: ({ row }) => (
      <Link to={`${row.id}`} style={{ color: 'inherit' }}>
        {row.name}
      </Link>
    ),
  },
  {
    headerName: '',
    field: 'action',
    type: 'actions',
    getActions: ({ row }) => {
      if (!isMultiple) {
        return [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="hugeicons:delete-01" />}
            label={t('actions.delete')}
            onClick={() => cellClick(row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="icon-park-outline:back" />}
            label={t('archive.takeArchive')}
            onClick={() => unarchive(row.id)}
          />,
        ];
      }
      return [];
    },
  },
];
