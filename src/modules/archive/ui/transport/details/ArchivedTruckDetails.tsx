import { useState } from 'react';
import { useParams } from 'react-router';

import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import { useBoolean } from 'src/hooks/use-boolean';
import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';
import { useTrucksFilter } from 'src/modules/settings/ui/truck/filter';
import { ITruckDetails } from 'src/modules/settings/types/truckDetails';
import { useGetArchiedTruckOrders } from 'src/modules/archive/hooks/useGetTruckOrder';
import { TruckOrderDetail } from 'src/modules/settings/ui/truckDetails/TruckOrderDetail';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';

import { baseColumns } from './col';

const ArchivedTruckDetails = () => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const shipmentLabels = useShipmentTypeLabels();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const [orderID, setOrderID] = useState<string>('');
  const params = useParams() as { id: string };

  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksFilter();
  const { data, isLoading, error } = useGetArchiedTruckOrders({
    id: params.id,
    params: {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
  });
  const openDialog = useBoolean();

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
  >('archiveTruckDetailsColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('archiveTruckDetailsColumnsVisibility', initialVisibility);

  if (error) return <ErrorData />;
  return (
    <>
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
            onColumnResize={handleColumnResizeStop}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
            hasTotal={false}
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
    </>
  );
};

export default ArchivedTruckDetails;
