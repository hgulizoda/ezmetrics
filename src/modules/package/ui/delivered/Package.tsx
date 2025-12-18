import { useState, useRef, useMemo } from 'react';

import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useTranslate } from 'src/locales';

import { NoData } from 'src/components/no-data copy/no-data';
import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { baseColumns } from './col';
import { DeliveredFilter } from './Filter';
import { IUserId } from '../../../../types/UserId';
import { useDeliveredTableFilter } from './useFilter';
import { useGetAllPackages } from '../../hook/allPackages';
import { IAllPackagesAdapter } from '../../types/AllPackages';
import { useExcelDownload } from '../../libs/useExcelDownload';
import { useArchivePackage } from '../../hook/useArchivePackage';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useBackPrevStepSingleOrder } from '../../hook/useActionSingleOrder';
import { TruckOrderDetail } from '../../../settings/ui/truckDetails/TruckOrderDetail';

export const DeliveredPackageTable = () => {
  const { t } = useTranslate('lang');
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const {
    pagination,
    onPaginationChange,
    onFilterChange,
    defaultFilter,
    filter,
    search,
    onSearchChange,
  } = useDeliveredTableFilter();
  const { onBackPackage, isBacking } = useBackPrevStepSingleOrder('in_customs', 'residuePackages');
  const { mutateAsync, isPending } = useArchivePackage(rowSelectionModel, 'residuePackages');
  const { data, error, isLoading } = useGetAllPackages({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    status: 'delivered',
    search,
    ...filter,
  });
  const { isPending: isDownloading, download } = useExcelDownload({
    name: t('packages.status.delivered'),
    params: { ...filter, status: 'delivered' },
  });
  const openBackDialog = useBoolean();
  const archiveDialog = useBoolean();
  const view = useBoolean();

  const [orderID, setOrderID] = useState<string>('');
  const [packageID, setPackageID] = useState<IUserId>({ id: '', userId: '' });
  const [archivedOrderId, setArchivedOrderId] = useState<string>('');

  const onArchive = async () => {
    await mutateAsync(archivedOrderId);
    archiveDialog.onFalse();
  };

  const archive = (id: string) => {
    setArchivedOrderId(id);
    archiveDialog.onTrue();
  };

  const onViewOrder = (id: string) => {
    setOrderID(id);
    view.onTrue();
  };
  const back = (id: string, userID: string) => {
    setPackageID({ id, userId: userID });
    openBackDialog.onTrue();
  };
  const onBack = async () => {
    await onBackPackage({ id: packageID.id, userID: packageID.userId });
    openBackDialog.onFalse();
  };

  const initialColumns = baseColumns({
    archive,
    isMultiple: rowSelectionModel.length > 0,
    onViewOrder,
    back,
    t,
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('deliveredColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('deliveredColumnsVisibility', initialVisibility);

  const rowCountRef = useRef(data?.pagination?.total_records || 0);

  const rowCount = useMemo(() => {
    if (data?.pagination?.total_records !== undefined) {
      rowCountRef.current = data.pagination.total_records;
    }
    return rowCountRef.current;
  }, [data?.pagination?.total_records]);

  if (error) return <ErrorData />;
  if (!data) return <NoData />;
  return (
    <Box height={700}>
      <DataGridCustom<IAllPackagesAdapter>
        col={columns}
        onColumnResize={handleColumnResizeStop}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        columnVisibilityModel={columnVisibilityModel}
        search={search}
        onSearchChange={onSearchChange}
        data={data.item}
        loading={isLoading}
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        totals={data.totals}
        checkBoxSelection
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        multiStatusAction={archiveDialog.onTrue}
        rowCount={rowCount}
        multiStatusTitle={t('actions.archive')}
        filterComponent={
          <DeliveredFilter
            defaultValues={defaultFilter}
            onChange={onFilterChange}
            download={download}
            isPending={isDownloading}
          />
        }
      />
      {orderID && (
        <Dialog open={view.value} onClose={view.onFalse} fullWidth maxWidth="md" scroll="body">
          <TruckOrderDetail orderID={orderID} onClose={view.onFalse} />
        </Dialog>
      )}
      <ConfirmDialog
        open={archiveDialog.value}
        onClose={archiveDialog.onFalse}
        title={t('packages.actions.archivePackage')}
        action={
          <>
            <LoadingButton onClick={archiveDialog.onFalse} variant="contained" color="error">
              {t('actions.not')}
            </LoadingButton>
            <LoadingButton
              onClick={onArchive}
              loading={isPending}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={openBackDialog.value}
        onClose={openBackDialog.onFalse}
        content={t('packages.actions.backToNormalize')}
        title={t('packages.actions.backChinaWarehouseTitle')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openBackDialog.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton loading={isBacking} variant="contained" color="primary" onClick={onBack}>
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
    </Box>
  );
};
