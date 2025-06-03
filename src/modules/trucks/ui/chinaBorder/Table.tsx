import { useState } from 'react';

import { Box } from '@mui/material';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import { baseColumns } from './col';
import { useGetTrucks } from '../../hooks/border';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useTrucksPagination } from '../../hooks/usePagination';
import { SendTrucktoTransit } from '../actions/SendTrucktoTransit';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

export const ChinaBorderTrucks = () => {
  const { t } = useTranslate('lang');

  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksPagination();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [truckID, setTruckID] = useState<string>('');
  const openSendedTruck = useBoolean();
  const formatDate = useFormatDate();

  const { data, isLoading, error } = useGetTrucks(
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
    'to_china_border'
  );
  const handleRowChange = (id: string) => {
    setTruckID(id);
    openSendedTruck.onTrue();
  };

  if (error) return <ErrorData />;
  return (
    <Box height={700}>
      <DataGridCustom
        col={baseColumns({ action: handleRowChange, t, formatDate })}
        data={data?.trucks || []}
        multiStatusTitle={t('multiStatusActions.sendTransit')}
        checkBoxSelection
        hasTotal={false}
        loading={isLoading}
        initialState={{ pagination: { paginationModel: pagination } }}
        onPaginationModelChange={onPaginationChange}
        rowSelectionModel={selectedRows}
        setRowSelectionModel={setSelectedRows}
        multiStatusAction={openSendedTruck.onTrue}
        search={search}
        onSearchChange={onSearchChange}
      />

      <SendTrucktoTransit
        open={openSendedTruck.value}
        onClose={openSendedTruck.onFalse}
        id={truckID}
        trucks={selectedRows}
        status="in_transit"
      />
    </Box>
  );
};
