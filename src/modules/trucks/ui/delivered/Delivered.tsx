import { useState, useRef, useMemo } from 'react';

import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';
import { useArchiveTruck, useArchiveTruckMultiple } from 'src/modules/settings/hooks/trucks';

import { baseColumns } from './col';
import { useGetTrucks } from '../../hooks/border';
import { useBackTruck } from '../../hooks/useBackTruck';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useTrucksPagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

export const DeliveredTrucks = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useBackTruck('in_customs');
  const [truckID, setTruckID] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { archiveTruck, archiving } = useArchiveTruck();
  const { archiveTruckMultiple, multiarchiving } = useArchiveTruckMultiple(selectedRows);
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();

  const openSendedTruck = useBoolean();
  const { data, isLoading, error } = useGetTrucks(
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
    'delivered'
  );
  const formatDate = useFormatDate();
  const openBackedTruck = useBoolean();
  const handleRowChange = (id: string) => {
    setTruckID(id);
    openSendedTruck.onTrue();
  };

  const onConfirmArchive = async () => {
    if (selectedRows.length) {
      await archiveTruckMultiple();
    } else {
      await archiveTruck(truckID);
    }
    openSendedTruck.onFalse();
  };

  const backTruckPrevStatus = (id: string) => {
    setTruckID(id);
    openBackedTruck.onTrue();
  };

  const rowCountRef = useRef(data?.pagination?.total_records || 0);

  const rowCount = useMemo(() => {
    if (data?.pagination?.total_records !== undefined) {
      rowCountRef.current = data.pagination.total_records;
    }
    return rowCountRef.current;
  }, [data?.pagination?.total_records]);

  if (error) return <ErrorData />;

  return (
    <Box height={700}>
      <DataGridCustom
        search={search}
        onSearchChange={onSearchChange}
        col={baseColumns({ action: handleRowChange, t, formatDate, back: backTruckPrevStatus })}
        data={data?.trucks || []}
        checkBoxSelection
        hasTotal={false}
        loading={isLoading}
        rowCount={rowCount}
        initialState={{ pagination: { paginationModel: pagination } }}
        onPaginationModelChange={onPaginationChange}
        rowSelectionModel={selectedRows}
        setRowSelectionModel={setSelectedRows}
        multiStatusAction={openSendedTruck.onTrue}
        multiStatusTitle={t('actions.archive')}
      />

      <ConfirmDialog
        open={openSendedTruck.value}
        onClose={openSendedTruck.onFalse}
        title={t('transport.actions.archiveTruck')}
        content={t('packages.actions.archiveTruckAllPackages')}
        action={
          <>
            <LoadingButton variant="contained" onClick={openSendedTruck.onFalse} color="error">
              {t('actions.not')}
            </LoadingButton>
            <LoadingButton
              loading={archiving || multiarchiving}
              onClick={onConfirmArchive}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />

      {truckID && (
        <ConfirmDialog
          title={t('packages.actions.backTruckToPrevTitle')}
          open={openBackedTruck.value}
          content={t('packages.actions.backTruckToPrevContent')}
          onClose={openBackedTruck.onFalse}
          action={
            <>
              <Button variant="contained" color="error" onClick={openBackedTruck.onFalse}>
                {t('actions.not')}
              </Button>
              <LoadingButton
                onClick={async () => {
                  await mutateAsync(truckID);
                  openBackedTruck.onFalse();
                }}
                variant="contained"
                color="primary"
                loading={isPending}
              >
                {t('actions.yes')}
              </LoadingButton>
            </>
          }
        />
      )}
    </Box>
  );
};
