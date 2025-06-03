import { useState } from 'react';

import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import usePersistedColumnWidths from 'src/hooks/use-resizestop-table';
import usePersistedColumnVisibilityModel, {
  ColumnVisibilityModel,
} from 'src/hooks/use-col-visibility';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';

import { baseColumns } from './col';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useArchivePagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';
import {
  useDeletePackage,
  useUnArchivePackage,
  useGetArchivePackages,
} from '../../hooks/usePackages';

export const ArchivedPackages = () => {
  const formatDate = useFormatDate();
  const { t } = useTranslate('lang');
  const shipmentLabels = useShipmentTypeLabels();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const { onPaginationChange, pagination, search, onSearchChange } = useArchivePagination();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const { onDeleting, isDeleting } = useDeletePackage({
    selectedPackages,
    params: {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
  });
  const { data, isLoading, error } = useGetArchivePackages({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });

  const { isUnArchiving, onUnArchive } = useUnArchivePackage({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const [userID, setUserID] = useState<string>('');
  const openConfirmDialog = useBoolean();
  const openUnArchive = useBoolean();
  const onDelete = (id: string) => {
    setUserID(id);
    openConfirmDialog.onTrue();
  };
  const multiStateActions = () => openConfirmDialog.onTrue();

  const deletePackage = async () => {
    await onDeleting(userID);
    openConfirmDialog.onFalse();
  };

  const initialColumns = baseColumns({
    onDelete,
    t,
    shipmentLabels,
    tooltipLabels,
    formatDate,
    unarchive: (id: string) => {
      setUserID(id);
      openUnArchive.onTrue();
    },
  });

  const { columns, handleColumnResizeStop } = usePersistedColumnWidths<
    (typeof initialColumns)[number]
  >('archivePackageColumns', initialColumns);

  const initialVisibility: ColumnVisibilityModel = columns.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {} as ColumnVisibilityModel);

  const { columnVisibilityModel, handleColumnVisibilityModelChange } =
    usePersistedColumnVisibilityModel('archivePackageColumnsVisibility', initialVisibility);

  if (error) return <ErrorData />;
  return (
    <>
      <DataGridCustom
        multiStatusAction={multiStateActions}
        col={columns}
        onColumnResize={handleColumnResizeStop}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        columnVisibilityModel={columnVisibilityModel}
        data={data?.packages || []}
        hasTotal={false}
        checkBoxSelection
        loading={isLoading}
        search={search}
        onSearchChange={onSearchChange}
        rowSelectionModel={selectedPackages}
        setRowSelectionModel={setSelectedPackages}
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        multiStatusTitle={t('actions.delete')}
      />
      <ConfirmDialog
        open={openConfirmDialog.value}
        onClose={openConfirmDialog.onFalse}
        title={t('archive.actions.orderDelete')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openConfirmDialog.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={deletePackage}
              loading={isDeleting}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />

      <ConfirmDialog
        open={openUnArchive.value}
        onClose={openUnArchive.onFalse}
        title={t('archive.takeArchive')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openUnArchive.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={() => onUnArchive(userID).then(() => openUnArchive.onFalse())}
              loading={isUnArchiving}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
    </>
  );
};
