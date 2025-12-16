import { useState, useRef, useMemo } from 'react';
import { Trans } from 'react-i18next';

import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import { baseColumns } from './col';
import { useGetTrucks } from '../../hooks/border';
import { useBackTruck } from '../../hooks/useBackTruck';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useTrucksPagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useSendTruckNextStep } from '../../hooks/useSendTruckNextStep';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

export const TransitTrucks = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useBackTruck('to_china_border');
  const [truckID, setTruckID] = useState<string>('');
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const formatDate = useFormatDate();
  const { onSending, isSending } = useSendTruckNextStep(
    truckID,
    'to_uzb_customs',
    selectedRows,
    'truckDetails'
  );
  const openSendedTruck = useBoolean();
  const openBackedTruck = useBoolean();
  const { data, isLoading, error } = useGetTrucks(
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
    'in_transit'
  );
  const handleRowChange = (id: string) => {
    setTruckID(id);
    openSendedTruck.onTrue();
  };

  const sendTruckToUzbCustom = async () => {
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
        multiStatusTitle={t('multiStatusActions.sendUZB')}
        multiStatusIcon="twemoji:flag-uzbekistan"
      />

      <ConfirmDialog
        open={openSendedTruck.value}
        onClose={openSendedTruck.onFalse}
        title={
          <Trans t={t} i18nKey="packages.actions.sendUZB">
            <Iconify icon="twemoji:flag-uzbekistan" />
          </Trans>
        }
        content={
          <Trans t={t} i18nKey="packages.actions.sendUZBCustomsDescription">
            <Iconify icon="twemoji:flag-uzbekistan" />
          </Trans>
        }
        action={
          <>
            <Button onClick={openSendedTruck.onFalse} variant="contained" color="error">
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
