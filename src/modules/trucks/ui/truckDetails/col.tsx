import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridColDef, GridActionsCellItem, GridColumnGroupingModel } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import { ITruckDetails } from 'src/modules/settings/types/truckDetails';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { ShipmentTypeIcons, ShipmentTypeLabelsColors } from '../../../../types/TableStatus';

interface Props {
  separate: (id: string) => void;
  edit: (id: string) => void;
  archive: (id: string) => void;
  onViewOrder: (id: string) => void;
  takeDown: (id: string) => void;
  t: TFunction;
  shipmentLabels: any;
  tooltipLabels: any;
  isDelivered: boolean;
}

export const baseColumns = ({
  archive,
  edit,
  separate,
  onViewOrder,
  takeDown,
  t,
  shipmentLabels,
  tooltipLabels,
  isDelivered,
}: Props): GridColDef<ITruckDetails>[] => [
  {
    headerName: t('packages.tableTitle.clientID'),
    field: 'userID',
    width: 200,
    renderCell: ({ row }) => (
      <Link to={`/dashboard/users/${row.clientID}`} style={{ color: 'inherit' }}>
        {row.userID}
      </Link>
    ),
  },
  {
    headerName: t('packages.tableTitle.packageNumber'),
    field: 'totalPlace',
    width: 200,
    renderCell: ({ row }) => <Box>{fNumber(row.totalPlace)}</Box>,
  },
  {
    headerName: t('packages.tableTitle.stockNumber'),
    field: 'totalCount',
    width: 200,
    renderCell: ({ row }) => <Box>{fNumber(row.totalCount)}</Box>,
  },
  {
    headerName: t('packages.tableTitle.capacity'),
    field: 'orderCapacity',
    width: 200,
    renderCell: ({ row }) => <Box>{fNumber(row.orderCapacity)} m³</Box>,
  },
  {
    headerName: t('packages.tableTitle.weight'),
    field: 'orderWeight',
    width: 200,
    renderCell: ({ row }) => <Box>{fNumber(row.orderWeight)} kg</Box>,
  },
  {
    headerName: t('packages.tableTitle.description'),
    field: 'description',
    width: 200,
    renderCell: ({ row }) => (
      <Button variant="soft" onClick={() => onViewOrder(row.id)}>
        {row.description}
      </Button>
    ),
  },
  {
    headerName: t('packages.tableTitle.status'),
    field: 'status',
    width: 200,
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
    field: 'actions',
    headerName: '',
    align: 'right',
    type: 'actions',
    maxWidth: 50,
    getActions: ({ row }) => {
      if (isDelivered) {
        return [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="material-symbols:archive" />}
            label={t('actions.archive')}
            onClick={() => archive(row.id)}
          />,
        ];
      }
      return [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="lucide:separator-horizontal" />}
          label={t('packages.actions.partial')}
          onClick={() => separate(row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="mdi:truck-remove" />}
          label={t('packages.actions.takePackage')}
          onClick={() => takeDown(row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="material-symbols:edit" />}
          label={t('actions.edit')}
          onClick={() => edit(row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="material-symbols:archive" />}
          label={t('actions.archive')}
          onClick={() => archive(row.id)}
        />,
      ];
    },
  },
];

export const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal (not freeReordering)',
    description: '',
    children: [{ field: 'id' }, { field: 'isAdmin' }],
  },
  {
    groupId: 'naming',
    headerName: 'Full name (freeReordering)',
    freeReordering: true,
    children: [{ field: 'lastName' }, { field: 'firstName' }],
  },
];
