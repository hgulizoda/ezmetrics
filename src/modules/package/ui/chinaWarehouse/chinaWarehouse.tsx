import { useNavigate } from 'react-router-dom';
import { useRef, useMemo, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';
import { getMatchingObjects } from 'src/modules/package/libs/sortByID';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { IUserId } from 'src/types/UserId';

import { baseColumns } from './col';
import { ChinaWarehouseFilter } from './Filter';
import { SeparateOrder } from '../actions/SeparateOrder';
import { useChinaWarehouseTableFilter } from './useFilter';
import { IChinaWarehouse } from '../../types/ChinaWarehouse';
import { useExcelDownload } from '../../libs/useExcelDownload';
import { useArchivePackage } from '../../hook/useArchivePackage';
import { ChangeToChinaBorder } from '../actions/ChangeToChinaBorder';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useGetChinaWarehouseOrders } from '../../hook/chinaWarehouse';
import { TruckOrderDetail } from '../../../settings/ui/truckDetails/TruckOrderDetail';

type ExtendedUserId = IUserId & { clientId: string };

const ChinaWarehouseTable = () => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const deletePackage = useBoolean();
  const openSeparate = useBoolean();
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const { mutateAsync, isPending } = useArchivePackage(rowSelectionModel, 'chinaWarehouse');
  const {
    onPaginationChange,
    pagination,
    defaultFilter,
    filter,
    onFilterChange,
    search,
    onSearchChange,
  } = useChinaWarehouseTableFilter();
  const [orderID, setOrderID] = useState<string>('');
  const { data, isLoading, error } = useGetChinaWarehouseOrders({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
    ...filter,
  });

  const { download, isPending: downloading } = useExcelDownload({
    params: { ...filter, status: 'in_china_warehouse' },
    name: 'Xitoydagi omborda',
  });

  const [packageId, setPackageId] = useState<ExtendedUserId>({
    id: '',
    userId: '',
    clientId: '',
  });
  const showModal = useBoolean();
  const view = useBoolean();

  const onViewOrder = (id: string) => {
    setOrderID(id);
    view.onTrue();
  };

  const changeStatus = (id: string, userId: string, clientId: string) => {
    setPackageId({ id, userId, clientId });
    showModal.onTrue();
  };

  const handleRowIDs = () => {
    showModal.onTrue();
  };
  const sortedOrders = getMatchingObjects<IChinaWarehouse>(data.orders, rowSelectionModel);

  // Get full selected rows for totals calculation
  const selectedRows = data.orders.filter((order) => rowSelectionModel.includes(order.id));

  // Calculate totals for selected rows
  const selectedTotals = selectedRows.reduce(
    (acc, order) => ({
      total_capacity: acc.total_capacity + (order.packageCapacity || 0),
      total_weight: acc.total_weight + (order.packageWeight || 0),
      counts: acc.counts + (order.totalCount || 0),
      places: acc.places + (order.totalPlaces || 0),
    }),
    { total_capacity: 0, total_weight: 0, counts: 0, places: 0 }
  );

  // Calculate average weight for selected rows
  const selectedAverageWeight =
    selectedRows.length > 0 ? selectedTotals.total_weight / selectedTotals.total_capacity : 0;

  // Calculate average weight for all data
  const allDataAverageWeight =
    data.orders.length > 0 ? data.totals.total_weight / data.totals.total_capacity : 0;

  // Use selected totals if rows are selected, otherwise use all data totals
  // Includes both total_weight (sum) and average_weight (average) separately
  const displayTotals =
    rowSelectionModel.length > 0
      ? {
          ...selectedTotals,
          average_weight: selectedAverageWeight,
        }
      : {
          ...data.totals,
          average_weight: allDataAverageWeight,
        };

  const openDeleteModal = (id: string) => {
    setOrderID(id);
    deletePackage.onTrue();
  };
  const onArchivePackage = async () => {
    await mutateAsync(orderID);
    deletePackage.onFalse();
  };

  const edit = (id: string) => {
    navigate(`/dashboard/update-package/${id}`);
  };

  const separate = (id: string) => {
    setOrderID(id);
    openSeparate.onTrue();
  };

  const initialColumns = baseColumns({
    cellClick: changeStatus,
    onViewOrder,
    isMultiple: rowSelectionModel.length > 0,
    onArchive: openDeleteModal,
    edit,
    separate,
    t,
    formatDate,
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('chinaWarehouseColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('chinaWarehouseColumnsVisibility', initialVisibility);

  const rowCountRef = useRef(data?.pagination?.total_records || 0);

  const rowCount = useMemo(() => {
    if (data?.pagination?.total_records !== undefined) {
      rowCountRef.current = data.pagination.total_records;
    }
    return rowCountRef.current;
  }, [data?.pagination?.total_records]);

  if (!data || error) return <ErrorData />;

  return (
    <Box height={700}>
      <DataGridCustom<IChinaWarehouse>
        loading={isLoading}
        search={search}
        onSearchChange={onSearchChange}
        multiStatusTitle={t('multiStatusActions.sendChinaBorder')}
        col={columns}
        onColumnResize={handleColumnResizeStop}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        data={data.orders}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        multiStatusAction={handleRowIDs}
        checkBoxSelection
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        totals={displayTotals}
        rowCount={rowCount}
        filterComponent={
          <ChinaWarehouseFilter
            onChange={onFilterChange}
            defaultValues={defaultFilter}
            isPending={downloading}
            download={download}
          />
        }
      />
      <ChangeToChinaBorder
        packageId={packageId}
        open={showModal.value}
        onClose={showModal.onFalse}
        rowIDs={sortedOrders}
      />
      {orderID && (
        <Dialog open={view.value} onClose={view.onFalse} fullWidth maxWidth="md" scroll="body">
          <TruckOrderDetail orderID={orderID} onClose={view.onFalse} />
        </Dialog>
      )}
      {orderID && (
        <ConfirmDialog
          open={deletePackage.value}
          onClose={deletePackage.onFalse}
          title={t('packages.actions.archivePackage')}
          action={
            <>
              <Button onClick={deletePackage.onFalse} variant="contained" color="error">
                {t('actions.not')}
              </Button>
              <LoadingButton
                onClick={onArchivePackage}
                loading={isPending}
                variant="contained"
                color="primary"
              >
                {t('actions.yes')}
              </LoadingButton>
            </>
          }
        />
      )}
      <SeparateOrder
        open={openSeparate.value}
        onClose={openSeparate.onFalse}
        id={orderID}
        query="chinaWarehouse"
      />
    </Box>
  );
};

export default ChinaWarehouseTable;
