import { get } from 'lodash';
import { useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Box } from '@mui/material';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';
import { user } from 'src/modules/user/api/userApi';
import { IUserRes } from 'src/modules/user/types/User';
import { useAllTableFilter } from 'src/modules/package/ui/allPackages/useFilter';
import { useGetProfileOrders } from 'src/modules/package/hook/useGetProfileOrders';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { IApiResponse } from 'src/types/ApiRes';
import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';

import { userStatisticsDetailColumns } from './detailCol';

const UserStatisticsDetailTable = () => {
  const { userId } = useParams<{ userId: string }>();
  const { onPaginationChange, pagination, search, onSearchChange } = useAllTableFilter();
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const shipmentLabel = useShipmentTypeLabels();
  const shipmentToolTip = useShipmentTooltipTypeLabels();

  // Check if userId is MongoDB ObjectId format (24 hex characters)
  const isMongoObjectId = !!userId?.match(/^[0-9a-fA-F]{24}$/);

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userByUserId', userId],
    queryFn: () => user.getAll({ search: userId || '', limit: 1 }),
    select: (res: IApiResponse<IUserRes>) => {
      const users = get(res, 'data', []);
      const foundUser = users.find((u) => u.user_id === userId);
      return foundUser?._id || null;
    },
    enabled: !!userId && !isMongoObjectId,
  });

  const userObjectId = isMongoObjectId ? userId : (userData ?? null);

  const {
    profileOrders,
    totals,
    pagination: paginationData,
    isLoading: isLoadingOrders,
    error,
  } = useGetProfileOrders(userObjectId ?? '', undefined, {
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });

  const rowCountRef = useRef(paginationData?.total_records || 0);

  const rowCount = useMemo(() => {
    if (paginationData?.total_records !== undefined) {
      rowCountRef.current = paginationData.total_records;
    }
    return rowCountRef.current;
  }, [paginationData?.total_records]);

  const isLoading =
    (isLoadingUser && !isMongoObjectId) ||
    (isLoadingOrders && !!userObjectId) ||
    (!userObjectId && !isMongoObjectId);

  if (error) return <ErrorData />;

  const columns = userStatisticsDetailColumns({
    t,
    shipmentLabel,
    shipmentToolTip,
    formatDate,
  });

  const mappedTotals = totals
    ? {
        total_capacity: totals.total_capacity,
        total_weight: totals.total_weight,
        counts: totals.total_counts,
        places: totals.total_places,
      }
    : undefined;

  return (
    <Box height={700}>
      <DataGridCustom
        data={profileOrders || []}
        col={columns}
        loading={isLoading || (!userObjectId && !isMongoObjectId)}
        checkBoxSelection={false}
        onPaginationModelChange={onPaginationChange}
        initialState={{
          pagination: { paginationModel: pagination },
        }}
        rowCount={rowCount}
        getRowId={(row) => row.id}
        search={search}
        onSearchChange={onSearchChange}
        hasTotal
        totals={mappedTotals}
      />
    </Box>
  );
};

export default UserStatisticsDetailTable;
