import { Box } from '@mui/material';

import { useAllTableFilter } from 'src/modules/package/ui/allPackages/useFilter';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { column } from './col';
import { useGetStatistics } from '../hooks/useGetStatistics';

const TableStatistics = () => {
  const { onPaginationChange, pagination, search, onSearchChange } = useAllTableFilter();
  const { data, isLoading, error } = useGetStatistics({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  if (error) return <ErrorData />;
  return (
    <Box height={700}>
      <DataGridCustom
        data={data?.list || []}
        col={column()}
        loading={isLoading}
        hasTotal={false}
        checkBoxSelection={false}
        onPaginationModelChange={onPaginationChange}
        initialState={{
          pagination: { paginationModel: pagination },
        }}
        rowCount={data?.pagination.totalRecords}
        getRowId={() => crypto.randomUUID()}
        search={search}
        onSearchChange={onSearchChange}
      />
    </Box>
  );
};

export default TableStatistics;
