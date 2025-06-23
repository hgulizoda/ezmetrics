import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { GridColDef } from '@mui/x-data-grid';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { fNumber } from 'src/utils/format-number';

import { ITruckDetails } from 'src/modules/settings/types/truckDetails';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ShipmentTypeIcons, ShipmentTypeLabelsColors } from 'src/types/TableStatus';

interface Props {
  cellClick: (id: string) => void;
  t: TFunction;
  shipmentLabels: any;
  tooltipLabels: any;
  formatDate: any;
}

export const baseColumns = ({
  cellClick,
  t,
  shipmentLabels,
  tooltipLabels,
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
    field: 'totalPlaces',
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
    headerName: t('packages.tableTitle.weight'),
    field: 'orderWeight',
    width: 200,
    renderCell: ({ row }) => <Box>{row.orderWeight} kg</Box>,
  },
  {
    headerName: t('packages.tableTitle.capacity'),
    field: 'orderCapacity',
    width: 200,
    renderCell: ({ row }) => <Box>{row.orderCapacity} m³</Box>,
  },
  {
    headerName: t('packages.tableTitle.description'),
    field: 'orderID',
    width: 200,
    renderCell: ({ row }) => (
      <Button variant="soft" onClick={() => cellClick(row.id)}>
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
];
