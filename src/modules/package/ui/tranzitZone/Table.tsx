import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useTranslate } from 'src/locales';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { baseColumns } from './col';
import { TransitZoneFilter } from './Filter';
import { IUserId } from '../../../../types/UserId';
import { useTransitZoneTableFilter } from './useFilter';
import { IResiduePackage } from '../../types/ResiduePackage';
import { useExcelDownload } from '../../libs/useExcelDownload';
import { useArchivePackage } from '../../hook/useArchivePackage';
import { AddPackageToTruck } from '../actions/AddPackageToTruck';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useGetWithoutTrucksPackages } from '../../hook/useResiduePackages';
import { useBackPrevStepSingleOrder } from '../../hook/useActionSingleOrder';
import { TruckOrderDetail } from '../../../settings/ui/truckDetails/TruckOrderDetail';

export const TranzitZoneTable = () => {
  const { t } = useTranslate('lang');
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const {
    pagination,
    onPaginationChange,
    onFilterChange,
    defaultFilter,
    filter,
    search,
    onSearchChange,
  } = useTransitZoneTableFilter();
  const { onBackPackage, isBacking } = useBackPrevStepSingleOrder(
    'to_china_border',
    'residuePackages'
  );
  const { mutateAsync, isPending } = useArchivePackage(rowSelectionModel, 'residuePackages');
  const { data, error, isLoading } = useGetWithoutTrucksPackages({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    status: 'in_transit',
    search,
    ...filter,
  });
  const { isPending: isDownloading, download } = useExcelDownload({
    name: t('packages.status.transit'),
    params: { ...filter, status: 'in_transit' },
  });

  const addTruckDialog = useBoolean();
  const openBackDialog = useBoolean();
  const archiveDialog = useBoolean();
  const view = useBoolean();

  const [orderID, setOrderID] = useState<string>('');
  const [packageID, setPackageID] = useState<IUserId>({ id: '', userId: '' });
  const [archivedOrderId, setArchivedOrderId] = useState<string>('');

  const collect = (id: string) => {
    setOrderID(id);
    addTruckDialog.onTrue();
  };

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
  const edit = (id: string) => {
    navigate(`/dashboard/update-package/${id}`);
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
    collect,
    archive,
    isMultiple: rowSelectionModel.length > 0,
    onViewOrder,
    edit,
    back,
    t,
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('transitColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('transitColumnsVisibility', initialVisibility);

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
      <DataGridCustom<IResiduePackage>
        col={columns}
        onColumnResize={handleColumnResizeStop}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        columnVisibilityModel={columnVisibilityModel}
        onSearchChange={onSearchChange}
        search={search}
        multiStatusTitle={t('packages.actions.addTruck')}
        data={data.packages}
        loading={isLoading}
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        totals={data.totals}
        checkBoxSelection
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        multiStatusAction={addTruckDialog.onTrue}
        rowCount={rowCount}
        filterComponent={
          <TransitZoneFilter
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
        content={t('packages.actions.backChinaBorderContent')}
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
      <AddPackageToTruck
        open={addTruckDialog.value}
        onClose={addTruckDialog.onFalse}
        selectedOrders={rowSelectionModel}
        singleOrder={orderID}
      />
    </Box>
  );
};
