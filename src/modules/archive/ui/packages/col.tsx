import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ShipmentTypeIcons, ShipmentTypeLabelsColors } from 'src/types/TableStatus';

import { IAllPackagesAdapter } from '../../../package/types/AllPackages';

interface Props {
  onDelete: (id: string) => void;
  t: TFunction;
  shipmentLabels: any;
  tooltipLabels: any;
  formatDate: any;
  unarchive: (id: string) => void;
}

export const baseColumns = ({
  onDelete,
  t,
  shipmentLabels,
  tooltipLabels,
  formatDate,
  unarchive,
}: Props): GridColDef<IAllPackagesAdapter>[] => [
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

    renderCell: ({ row }) => <Box>{row.clientId}</Box>,
  },
  {
    field: 'packageWeight',
    headerName: t('packages.tableTitle.weight'),
  },
  {
    field: 'packageCapacity',
    headerName: t('packages.tableTitle.capacity'),
  },

  {
    field: 'totalCount',
    headerName: t('packages.tableTitle.stockNumber'),
  },

  {
    field: 'totalPlaces',
    headerName: t('packages.tableTitle.packageNumber'),
  },
  {
    field: 'truck',
    headerName: t('packages.tableTitle.truck'),
    width: 150,
  },
  {
    field: 'description',
    headerName: t('packages.tableTitle.description'),
    width: 200,
  },
  {
    field: 'packageDate',
    width: 150,
    headerName: t('packages.tableTitle.sendedDate'),
    renderCell: ({ row }) => <Box>{formatDate(row.packageDate)}</Box>,
  },
  {
    field: 'statusUpdate',
    headerName: t('packages.tableTitle.updatedDate'),
    width: 150,
    renderCell: ({ row }) => <Box>{formatDate(row.statusUpdate)}</Box>,
  },
  {
    field: 'status',
    headerName: t('packages.tableTitle.status'),

    renderCell: ({ row }) => (
      <Tooltip
        title={tooltipLabels[row.status]}
        arrow
        placement="top"
        slotProps={{
          popper: {
            sx: {
              [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                {
                  marginTop: '0px',
                },
            },
          },
        }}
      >
        {ShipmentTypeIcons[row.status] === '' ? (
          <Label color={ShipmentTypeLabelsColors[row.status]}>{shipmentLabels[row.status]}</Label>
        ) : (
          <Label
            color={ShipmentTypeLabelsColors[row.status]}
            endIcon={<Iconify icon={ShipmentTypeIcons[row.status]} />}
          >
            {shipmentLabels[row.status]}
          </Label>
        )}
      </Tooltip>
    ),
  },
  {
    type: 'actions',
    headerName: '',
    field: 'action',
    width: 50,
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="hugeicons:delete-01" color="#FF4D4D" />}
        label={t('actions.delete')}
        sx={{ color: '#FF4D4D' }}
        onClick={() => onDelete(row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="icon-park-outline:back" />}
        label={t('archive.takeArchive')}
        onClick={() => unarchive(row.id)}
      />,
    ],
  },
];
