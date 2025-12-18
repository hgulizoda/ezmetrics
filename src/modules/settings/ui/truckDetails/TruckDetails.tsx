import { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Box, Container, Typography } from '@mui/material';

import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useFormatDate } from 'src/utils/iso-date';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import {
  OrderStatus,
  useShipmentTypeLabels,
  useShipmentTooltipTypeLabels,
} from 'src/types/TableStatus';

import { baseColumns } from './col';
import { useTrucksFilter } from '../truck/filter';
import Iconify from '../../../../components/iconify';
import { TruckOrderDetail } from './TruckOrderDetail';
import { ITruckDetails } from '../../types/truckDetails';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useGetTruckDetailsOrders } from '../../hooks/useTruckDetails';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

const TruckDetails = () => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const shipmentLabels = useShipmentTypeLabels();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const [orderID, setOrderID] = useState<string>('');

  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksFilter();
  const theme = useTheme();
  const params = useParams() as { id: string };
  const navigate = useNavigate();
  const openDialog = useBoolean();
  const { data, isLoading, error } = useGetTruckDetailsOrders({
    id: params.id,
    params: {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
  });
  const handleCellClick = (id: string) => {
    setOrderID(id);
    openDialog.onTrue();
  };

  const initialColumns = baseColumns({
    cellClick: handleCellClick,
    t,
    shipmentLabels,
    tooltipLabels,
    formatDate,
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('truckDetailsColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('truckDetailsVisibility', initialVisibility);

  if (error) return <ErrorData />;
  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            mb: 2,
            gap: 3,
          }}
        >
          <IconButton size="small" onClick={() => navigate(-1)}>
            <Iconify icon="weui:back-filled" />
          </IconButton>
          <Typography variant="subtitle1" display="flex" gap={1}>
            {data?.name}
            <Typography variant="subtitle1" color={theme.palette.grey[600]}>
              ({data?.orders.length})
            </Typography>
          </Typography>
          {data && (
            <Box display="flex" gap={0.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('transport.form.containerNumber')}:
                </Typography>
                <Typography variant="subtitle2">{data.containerNumber}</Typography>
              </Box>
              <Iconify icon="tabler:separator" />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('transport.createdTime')}:
                </Typography>
                <Typography variant="subtitle2">{formatDate(data.createdAt)}</Typography>
              </Box>
              <Iconify icon="tabler:separator" />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('transport.estimatedArrivalTime')}:
                </Typography>
                <Typography variant="subtitle2">{formatDate(data.arrivalDate)}</Typography>
              </Box>
              <Iconify icon="tabler:separator" />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('transport.truckStatus')}:
                </Typography>
                <Typography variant="subtitle2">
                  {data.status && shipmentLabels[data.status as OrderStatus]}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <IconButton onClick={openDialog.onTrue}>
          <Iconify icon="gravity-ui:plus" width={25} />
        </IconButton>
        <Box display="flex" ml={1} gap={1}>
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
        </Box>
      </Box>
      <Box
        sx={{
          borderRadius: '16px',
          border: '1px solid #919EAB1F',
          boxShadow: '0px 12px 24px -4px #919EAB1F',
          overflow: 'hidden',
        }}
      >
        <Box height={700}>
          <DataGridCustom<ITruckDetails>
            data={data?.orders || []}
            search={search}
            onSearchChange={onSearchChange}
            loading={isLoading}
            col={columns}
            onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
            columnVisibilityModel={columnVisibilityModel}
            onColumnResize={handleColumnResizeStop}
            hasTotal
            totals={{
              total_capacity: data?.totals?.total_capacity || 0,
              total_weight: data?.totals?.total_weight || 0,
              counts: data?.totals?.total_count || 0,
              places: data?.totals?.total_places || 0,
            }}
            onPaginationModelChange={onPaginationChange}
            initialState={{ pagination: { paginationModel: pagination } }}
          />
        </Box>
      </Box>
      {orderID && (
        <Dialog
          scroll="body"
          open={openDialog.value}
          onClose={openDialog.onFalse}
          fullWidth
          maxWidth="md"
        >
          <TruckOrderDetail orderID={orderID} onClose={openDialog.onFalse} />
        </Dialog>
      )}
    </Container>
  );
};

export default TruckDetails;
