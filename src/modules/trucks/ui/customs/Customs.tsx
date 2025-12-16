import { useState, useRef, useMemo } from 'react';

import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import { baseColumns } from './col';
import { useGetTrucks } from '../../hooks/border';
import { useBackTruck } from '../../hooks/useBackTruck';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useTrucksPagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useSendTruckNextStep } from '../../hooks/useSendTruckNextStep';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

export const CustomsTrucks = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useBackTruck('to_uzb_customs');
  const [truckID, setTruckID] = useState<string>('');
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { onSending, isSending } = useSendTruckNextStep(
    truckID,
    'delivered',
    selectedRows,
    'truckDetails'
  );

  const formatDate = useFormatDate();

  const openSendedTruck = useBoolean();
  const openBackedTruck = useBoolean();
  const { data, isLoading, error } = useGetTrucks(
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
    'in_customs'
  );
  const handleRowChange = (id: string) => {
    setTruckID(id);
    openSendedTruck.onTrue();
  };

  const onDelivered = async () => {
    await onSending();
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
        col={baseColumns({ action: handleRowChange, t, formatDate, back: backTruckPrevStatus })}
        data={data?.trucks || []}
        search={search}
        onSearchChange={onSearchChange}
        checkBoxSelection
        hasTotal={false}
        loading={isLoading}
        rowCount={rowCount}
        initialState={{ pagination: { paginationModel: pagination } }}
        onPaginationModelChange={onPaginationChange}
        rowSelectionModel={selectedRows}
        setRowSelectionModel={setSelectedRows}
        multiStatusAction={openSendedTruck.onTrue}
        multiStatusTitle={t('packages.actions.sendDelivered')}
      />

      <ConfirmDialog
        open={openSendedTruck.value}
        onClose={openSendedTruck.onFalse}
        title={t('packages.actions.sendDelivered')}
        content={t('packages.actions.sendDeliveredDescription')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openSendedTruck.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isSending}
              onClick={onDelivered}
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
