import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import { Box, Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';

import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ShipmentTypeIcons, ShipmentTypeLabelsColors } from 'src/types/TableStatus';

import { IAllPackagesAdapter } from '../../types/AllPackages';

interface Props {
  onViewOrder: (id: string) => void;
  t: TFunction;
  shipmentLabel: any;
  shipmentToolTip: any;
  formatDate: any;
}

export const baseColumns = ({
  onViewOrder,
  t,
  shipmentLabel,
  shipmentToolTip,
  formatDate,
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
    width: 130,
    renderCell: ({ row }) => <Box>{row.clientId}</Box>,
  },

  {
    field: 'totalPlaces',
    headerName: t('packages.tableTitle.packageNumber'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.totalPlaces)}</Box>,
  },
  {
    field: 'totalCount',
    headerName: t('packages.tableTitle.stockNumber'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.totalCount)}</Box>,
  },
  {
    field: 'packageCapacity',
    headerName: t('packages.tableTitle.capacity'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.packageCapacity)}</Box>,
  },
  {
    field: 'packageWeight',
    headerName: t('packages.tableTitle.weight'),
    width: 100,
    renderCell: ({ row }) => <Box>{fNumber(row.packageWeight)}</Box>,
  },

  {
    field: 'truck',
    headerName: t('packages.tableTitle.truck'),
    width: 150,
  },
  {
    field: 'containerNumber',
    headerName: t('transport.form.containerNumber'),
    width: 130,
    renderCell: ({ row }) => <Box>{row.containerNumber}</Box>,
  },
  {
    field: 'description',
    headerName: t('packages.tableTitle.description'),
    renderCell: ({ row }) => <Button onClick={() => onViewOrder(row.id)}>{row.description}</Button>,
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
    width: 130,
    renderCell: ({ row }) => (
      <Tooltip
        title={shipmentToolTip[row.status]}
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
          <Label color={ShipmentTypeLabelsColors[row.status]}>{shipmentLabel[row.status]}</Label>
        ) : (
          <Label
            color={ShipmentTypeLabelsColors[row.status]}
            endIcon={<Iconify icon={ShipmentTypeIcons[row.status]} />}
          >
            {shipmentLabel[row.status]}
          </Label>
        )}
      </Tooltip>
    ),
  },
];
