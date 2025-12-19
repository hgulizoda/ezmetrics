import { TFunction } from 'i18next';

import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ShipmentTypeIcons, ShipmentTypeLabelsColors } from 'src/types/TableStatus';

import { IProfileOrders } from '../../package/types/UserProfileOrders';

interface Props {
  t: TFunction;
  shipmentLabel: any;
  shipmentToolTip: any;
  formatDate: any;
}

export const userStatisticsDetailColumns = ({
  t,
  shipmentLabel,
  shipmentToolTip,
  formatDate,
}: Props): GridColDef<IProfileOrders>[] => [
  {
    field: 'description',
    headerName: t('profile.profileTab.ordername'),
    flex: 1,
    renderCell: ({ row }) => <Box>{row.description}</Box>,
  },
  {
    field: 'status',
    headerName: t('profile.ordersTabs.card.status'),
    flex: 1,
    renderCell: ({ row }) => {
      const currentStatus = row.statusHistory[row.statusHistory.length - 1]?.status;
      const statusIcon = ShipmentTypeIcons[currentStatus];
      const statusColor = ShipmentTypeLabelsColors[currentStatus];
      const statusLabel = shipmentLabel[currentStatus] || currentStatus;
      const tooltipLabel = shipmentToolTip[currentStatus];

      return (
        <Label
          color={statusColor}
          startIcon={statusIcon ? <Iconify icon={statusIcon} /> : undefined}
          title={tooltipLabel}
        >
          {statusLabel}
        </Label>
      );
    },
  },
  {
    field: 'totalPlaces',
    headerName: t('profile.ordersTabs.card.totalPlaces'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.totalPlaces)}</Box>,
  },
  {
    field: 'totalCount',
    headerName: t('profile.ordersTabs.card.orderCount'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.totalCount)}</Box>,
  },
  {
    field: 'orderCapacity',
    headerName: t('profile.ordersTabs.card.orderCapacity'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.orderCapacity)}</Box>,
  },
  {
    field: 'orderWeight',
    headerName: t('profile.ordersTabs.card.orderWeight'),
    flex: 1,
    renderCell: ({ row }) => <Box>{fNumber(row.orderWeight)}</Box>,
  },
  {
    field: 'createdAt',
    headerName: t('profile.ordersTabs.card.created'),
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDate(row.createdAt)}</Box>,
  },
  {
    field: 'statusUpdatedAt',
    headerName: t('profile.ordersTabs.card.update'),
    flex: 1,
    renderCell: ({ row }) => <Box>{formatDate(row.statusUpdatedAt)}</Box>,
  },
];
