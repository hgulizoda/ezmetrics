import { useLocation } from 'react-router-dom';
import { useRef, useMemo, useState } from 'react';

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

export const UZBTrucks = () => {
  const { t } = useTranslate('lang');
  const location = useLocation();
  const { mutateAsync, isPending: isBacking } = useBackTruck('in_transit');
  const [truckID, setTruckID] = useState<string>('');
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { onSending, isSending } = useSendTruckNextStep(
    truckID,
    'in_customs',
    selectedRows,
    'truckDetails'
  );

  const { onSending: toDelivered, isSending: isPending } = useSendTruckNextStep(
    truckID,
    'delivered',
    selectedRows,
    'truckDetails'
  );

  const formatDate = useFormatDate();

  const openSendedTruck = useBoolean();
  const openBackedTruck = useBoolean();
  const openSendedDelivered = useBoolean();
  const { data, isLoading, error } = useGetTrucks(
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
    'to_uzb_customs'
  );
  const handleRowChange = (id: string) => {
    setTruckID(id);
    openSendedTruck.onTrue();
  };

  const sendTruckToUzbCustom = async () => {
    await onSending();
    openSendedTruck.onFalse();
  };

  const sendDelivered = async () => {
    await toDelivered();
    openSendedDelivered.onFalse();
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
        col={baseColumns({
          action: handleRowChange,
          t,
          formatDate,
          back: backTruckPrevStatus,
          from: `${location.pathname}${location.search}`,
        })}
        data={data?.trucks || []}
        checkBoxSelection
        hasTotal={false}
        loading={isLoading}
        rowCount={rowCount}
        search={search}
        onSearchChange={onSearchChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        onPaginationModelChange={onPaginationChange}
        rowSelectionModel={selectedRows}
        setRowSelectionModel={setSelectedRows}
        multiStatusAction={openSendedTruck.onTrue}
        multiStatusTitle={t('multiStatusActions.sendNormalize')}
        multiStatusComponent={
          <Button onClick={openSendedDelivered.onTrue} variant="contained" color="success">
            {t('packages.status.delivered')}
          </Button>
        }
      />

      <ConfirmDialog
        open={openSendedTruck.value}
        onClose={openSendedTruck.onFalse}
        title={t('packages.actions.sendNormalize')}
        content={t('packages.actions.sendNormalizeDescription')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openSendedTruck.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isSending}
              onClick={sendTruckToUzbCustom}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={openSendedDelivered.value}
        onClose={openSendedDelivered.onFalse}
        title={t('packages.delivered.title')}
        content={t('packages.delivered.content')}
        action={
          <>
            <Button variant="contained" color="error" onClick={openSendedDelivered.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isSending || isPending}
              onClick={sendDelivered}
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
                loading={isBacking}
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
