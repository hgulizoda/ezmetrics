import { useRef, useMemo } from 'react';

import { Box } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAllTableFilter } from 'src/modules/package/ui/allPackages/useFilter';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { column } from './col';
import { useGetStatistics } from '../hooks/useGetStatistics';

const TableStatistics = () => {
  const { onPaginationChange, pagination, search, onSearchChange } = useAllTableFilter();
  const {t} = useTranslate('lang');
  const { data, isLoading, error } = useGetStatistics({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });

  const rowCountRef = useRef(data?.pagination?.totalRecords || 0);

  const rowCount = useMemo(() => {
    if (data?.pagination?.totalRecords !== undefined) {
      rowCountRef.current = data.pagination.totalRecords;
    }
    return rowCountRef.current;
  }, [data?.pagination?.totalRecords]);

  if (error) return <ErrorData />;
  return (
    <Box height={700}>
      <DataGridCustom
        data={data?.list || []}
        col={column(t)}
        loading={isLoading}
        hasTotal={false}
        checkBoxSelection={false}
        onPaginationModelChange={onPaginationChange}
        initialState={{
          pagination: { paginationModel: pagination },
        }}
        rowCount={rowCount}
        getRowId={() => crypto.randomUUID()}
        search={search}
        onSearchChange={onSearchChange}
      />
    </Box>
  );
};

export default TableStatistics;
