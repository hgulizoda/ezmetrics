import { useMemo, useState } from 'react';

import { LoadingButton } from '@mui/lab';

import { useFormatDateHour } from 'src/utils/iso-date-hour';

import { useTranslate } from 'src/locales';
import { usePagination } from 'src/modules/notification/hooks/usePagination';

import { ConfirmDialog } from 'src/components/custome-dialog';

import { baseCol } from './col';
import { useGetPrice } from '../../hook/useGetPrices';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useDeletePrice } from '../../hook/useDeletePrice';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

export const AutoTable = () => {
  const { t } = useTranslate('lang');
  const formatDateHour = useFormatDateHour();
  const { search, onSearchChange } = usePagination();
  const { data, error, isLoading } = useGetPrice({ params: { search } });
  const prices = useMemo(() => data?.filter((item) => item.transportType === 'auto'), [data]) || [];
  const { onDelete, isDeleting } = useDeletePrice();
  const autoTypes = prices || [];
  const openDialog = useBoolean();
  const [priceId, setPriceId] = useState<string>('');

  const deletePrice = async () => {
    await onDelete(priceId);
    openDialog.onFalse();
  };

  if (error) return <ErrorData />;
  return (
    <>
      <DataGridCustom
        loading={isLoading}
        search={search}
        onSearchChange={onSearchChange}
        data={autoTypes}
        col={baseCol({
          onDelete: (id) => {
            setPriceId(id);
            openDialog.onTrue();
          },
          t,
          formatDateHour,
        })}
        hasTotal={false}
      />
      <ConfirmDialog
        open={openDialog.value}
        onClose={openDialog.onFalse}
        content={t('prices.formTable.auto.actions.deleteDescription')}
        title={t('actions.delete')}
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={deletePrice}
            loading={isDeleting}
          >
            {t('actions.delete')}
          </LoadingButton>
        }
      />
    </>
  );
};
