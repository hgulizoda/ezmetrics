import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import { GridPaginationModel } from '@mui/x-data-grid';

export function usePagination() {
  const [params, setParams] = useSearchParams({ page: '1', limit: '10' });

  const [{ page, pageSize }, setPagination] = useState<GridPaginationModel>({
    page: (Number(params.get('page')) ?? 1) - 1,
    pageSize: Number(params.get('limit')) ?? 10,
  });

  useEffect(() => {
    setParams({ page: String(page + 1), limit: String(pageSize) });
  }, [page, pageSize, setParams]);

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize]
  );

  return { pagination, setPagination };
}
