import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { useDebounce } from 'src/hooks/use-debounce';

export interface IFilter {
  truck: string;
}

export const useAllTableFilter = (defaultPage = 0, defaultPageSize = 100) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState(() => ({
    page: parseInt(searchParams.get('page') || `${defaultPage}`, 10),
    pageSize: parseInt(searchParams.get('limit') || `${defaultPageSize}`, 10),
  }));
  const defaultFilter = useMemo(
    () => ({
      truck: searchParams.get('truck') ?? '',
    }),
    [searchParams]
  );
  const [filter, setFilter] = useState<IFilter>(defaultFilter);
  const [search, setSearch] = useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const setParams = useCallback(
    (newParams: Record<string, string>) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        Object.entries(newParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        });

        return params;
      });
    },
    [setSearchParams]
  );

  const onPaginationChange = useCallback(
    (values: { pageSize: number; page: number }) => {
      setPagination(values);
      setParams({ page: values.page.toString(), limit: values.pageSize.toString() });
    },
    [setParams]
  );

  const onFilterChange = useCallback(
    (filters: Partial<IFilter>) => {
      setFilter((prev) => ({ ...prev, ...filters }));
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            const stringValue = Array.isArray(value) ? value.join(',') : value;
            params.set(key, stringValue.toString());
          } else {
            params.delete(key);
          }
        });
        return params;
      });
    },
    [setFilter, setSearchParams]
  );

  useEffect(() => {
    setParams({ search: debouncedSearch });
  }, [debouncedSearch, setParams]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch]
  );

  return {
    pagination,
    onPaginationChange,
    onFilterChange,
    filter,
    defaultFilter,
    search,
    onSearchChange,
  };
};
