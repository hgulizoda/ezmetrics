import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams, useLocation } from 'react-router';

import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useTranslate } from 'src/locales';
import { ITruckDetails } from 'src/modules/settings/types/truckDetails';
import { useGetTruckDetails } from 'src/modules/settings/hooks/useTruckDetails';

import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';

import { baseColumns } from './col';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useTrucksPagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useFullSeparatePackage } from '../../hooks/useSeparatePackage';
import { ErrorData } from '../../../../components/error-data/error-data';
import { SeparateOrder } from '../../../package/ui/actions/SeparateOrder';
import { useArchivePackage } from '../../../package/hook/useArchivePackage';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';
import { TruckOrderDetail } from '../../../settings/ui/truckDetails/TruckOrderDetail';

export const TruckOrders = ({ status }: { status: string }) => {
  const location = useLocation();
  const shipmentLabels = useShipmentTypeLabels();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const { t } = useTranslate('lang');
  const [orderID, setOrderID] = useState<string>('');
  const params = useParams() as { id: string };
  const openSeparate = useBoolean();
  const takeDownDialog = useBoolean();
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  const { isPending, mutateAsync } = useArchivePackage(selectedRow, 'truckDetails');
  const navigate = useNavigate();
  const { onTakeDown, isTaking } = useFullSeparatePackage(params.id);
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();
  const openDialog = useBoolean();
  const openArchiveDialog = useBoolean();
  const { data, isLoading, error } = useGetTruckDetails({
    id: params.id,
    params: { page: pagination.page + 1, limit: pagination.pageSize, search },
  });

  const onViewOrder = (id: string) => {
    setOrderID(id);
    openDialog.onTrue();
  };

  const edit = (id: string) => {
    navigate(`/dashboard/update-package/${id}`);
  };
  const separate = (id: string) => {
    setOrderID(id);
    openSeparate.onTrue();
  };
  const archive = (id: string) => {
    setOrderID(id);
    openArchiveDialog.onTrue();
  };
  const onArchive = async () => {
    await mutateAsync(orderID);
    openArchiveDialog.onFalse();
  };

  const takeDown = (id: string) => {
    setOrderID(id);
    takeDownDialog.onTrue();
  };

  const onTakeFromTruck = async () => {
    await onTakeDown(orderID);
    takeDownDialog.onFalse();
  };

  const initialColumns = baseColumns({
    onViewOrder,
    edit,
    archive,
    separate,
    takeDown,
    t,
    shipmentLabels,
    tooltipLabels,
    isDelivered: location.pathname.includes('delivered'),
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('truckOrderDetailsColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('truckOrderDetailsColumnsVisibility', initialVisibility);

  if (error) return <ErrorData />;

  return (
    <>
      <Box height={700}>
        <DataGridCustom<ITruckDetails>
          data={data?.orders || []}
          search={search}
          onSearchChange={onSearchChange}
          multiStatusTitle={t('actions.archive')}
          loading={isLoading}
          col={columns}
          onColumnResize={handleColumnResizeStop}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
          hasTotal
          checkBoxSelection
          onPaginationModelChange={onPaginationChange}
          initialState={{ pagination: { paginationModel: pagination } }}
          rowSelectionModel={selectedRow}
          setRowSelectionModel={setSelectedRow}
          multiStatusAction={openArchiveDialog.onTrue}
          totals={data?.totals}
        />
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

      <ConfirmDialog
        open={openArchiveDialog.value}
        onClose={openArchiveDialog.onFalse}
        title={t('packages.actions.archivePackage')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openArchiveDialog.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isPending}
              variant="contained"
              color="primary"
              onClick={onArchive}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={takeDownDialog.value}
        onClose={takeDownDialog.onFalse}
        title={t('packages.actions.takePackage')}
        content={t('packages.actions.takePackageDescription')}
        action={
          <>
            <Button variant="contained" color="error" onClick={takeDownDialog.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isTaking}
              variant="contained"
              color="primary"
              onClick={onTakeFromTruck}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />

      {orderID && (
        <SeparateOrder
          id={orderID}
          onClose={openSeparate.onFalse}
          open={openSeparate.value}
          query="truckDetails"
        />
      )}
    </>
  );
};
