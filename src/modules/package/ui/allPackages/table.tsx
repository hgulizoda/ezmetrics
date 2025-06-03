import { useState } from 'react';

import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';

import { baseColumns } from './col';
import { AllTableFilter } from './Filter';
import { useAllTableFilter } from './useFilter';
import { useGetAllPackages } from '../../hook/allPackages';
import { useBoolean } from '../../../../hooks/use-boolean';
import { IAllPackagesAdapter } from '../../types/AllPackages';
import { useExcelDownload } from '../../libs/useExcelDownload';
import { TruckOrderDetail } from '../../../settings/ui/truckDetails/TruckOrderDetail';

const TableAllPackages = () => {
  const formatDate = useFormatDate();
  const shipmentLabel = useShipmentTypeLabels();
  const shipmentToolTip = useShipmentTooltipTypeLabels();
  const { t } = useTranslate('lang');
  const {
    onPaginationChange,
    pagination,
    defaultFilter,
    filter,
    onFilterChange,
    search,
    onSearchChange,
  } = useAllTableFilter();
  const viewOrder = useBoolean();

  const [orderID, setOrderID] = useState<string>();
  const { isPending, download } = useExcelDownload({
    name: 'Barchasi',
    params: { ...filter, status: 'all' },
  });

  const { data, isLoading, error } = useGetAllPackages({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
    ...filter,
  });

  const onViewOrder = (id: string) => {
    setOrderID(id);
    viewOrder.onTrue();
  };

  const initialColumns = baseColumns({
    onViewOrder,
    t,
    shipmentLabel,
    shipmentToolTip,
    formatDate,
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('allPackagesTableColumns', initialColumns);
  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('allPackagesTableVisibility', initialVisibility);

  if (error || !data) return <ErrorData />;
  return (
    <Box height={700}>
      <DataGridCustom<IAllPackagesAdapter>
        data={data.item}
        col={columns}
        onColumnResize={handleColumnResizeStop}
        loading={isLoading}
        checkBoxSelection={false}
        onPaginationModelChange={onPaginationChange}
        initialState={{
          pagination: { paginationModel: pagination },
        }}
        totals={data.totals}
        rowCount={data.pagination?.total_records}
        filterComponent={
          <AllTableFilter
            defaultValues={defaultFilter}
            onChange={onFilterChange}
            download={download}
            isPending={isPending}
          />
        }
        search={search}
        onSearchChange={onSearchChange}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
      />

      {orderID && (
        <Dialog
          open={viewOrder.value}
          onClose={viewOrder.onFalse}
          fullWidth
          maxWidth="md"
          scroll="body"
        >
          <TruckOrderDetail orderID={orderID} onClose={viewOrder.onFalse} />
        </Dialog>
      )}
    </Box>
  );
};

export default TableAllPackages;
