import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { baseColumns } from './col';
import { Transport } from '../../types/Transport';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useArchivePagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';
import { useGetTransports, useUnArchiveTruck, useDeleteTransport } from '../../hooks/useTransport';

export const TransportsTable = () => {
  const { t } = useTranslate('lang');
  const location = useLocation();
  const { onPaginationChange, pagination, search, onSearchChange } = useArchivePagination();
  const { data, isLoading, error } = useGetTransports({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const { isUnArchiving, onUnArchive } = useUnArchiveTruck({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });

  const [rowSelected, setRowSelected] = useState<string[]>([]);
  const openConfirm = useBoolean();
  const unArchive = useBoolean();
  const [truckID, setTruckID] = useState<string>('');
  const { deleteTruck, isDeleting } = useDeleteTransport({
    rowSelected,
    params: {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
  });
  const cellClick = (id: string) => {
    setTruckID(id);
    openConfirm.onTrue();
  };
  const checkBoxSelected = () => openConfirm.onTrue();
  const handleDelete = async () => {
    await deleteTruck(truckID);
    openConfirm.onFalse();
  };
  if (error) return <ErrorData />;
  return (
    <>
      <DataGridCustom<Transport>
        data={data?.transports || []}
        search={search}
        onSearchChange={onSearchChange}
        loading={isLoading}
        col={baseColumns({
          cellClick,
          isMultiple: rowSelected.length > 0,
          t,
          from: `${location.pathname}${location.search}`,
          unarchive: (id: string) => {
            setTruckID(id);
            unArchive.onTrue();
          },
        })}
        hasTotal={false}
        checkBoxSelection
        rowSelectionModel={rowSelected}
        setRowSelectionModel={setRowSelected}
        multiStatusAction={checkBoxSelected}
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        multiStatusTitle={t('actions.delete')}
      />
      <ConfirmDialog
        title={t('actions.delete')}
        action={
          <>
            <LoadingButton variant="contained" color="error" onClick={openConfirm.onFalse}>
              {t('actions.not')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleDelete}
              loading={isDeleting}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        content={t('archive.actions.truckDelete')}
        open={openConfirm.value}
        onClose={openConfirm.onFalse}
      />

      <ConfirmDialog
        title={t('archive.takeArchive')}
        action={
          <>
            <LoadingButton variant="contained" color="error" onClick={unArchive.onFalse}>
              {t('actions.not')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={() => onUnArchive(truckID).then(() => unArchive.onFalse())}
              loading={isUnArchiving}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        content={t('archive.actions.truckUnArchive')}
        open={unArchive.value}
        onClose={unArchive.onFalse}
      />
    </>
  );
};
