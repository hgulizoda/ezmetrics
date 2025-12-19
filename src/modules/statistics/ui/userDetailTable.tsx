import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRef, useMemo } from 'react';

import { Box } from '@mui/material';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { useTranslate } from 'src/locales';
import { useAllTableFilter } from 'src/modules/package/ui/allPackages/useFilter';
import { useGetProfileOrders } from 'src/modules/package/hook/useGetProfileOrders';
import { user } from 'src/modules/user/api/userApi';
import { IUserRes } from 'src/modules/user/types/User';
import { IApiResponse } from 'src/types/ApiRes';
import { useShipmentTypeLabels, useShipmentTooltipTypeLabels } from 'src/types/TableStatus';
import { useFormatDate } from 'src/utils/iso-date';

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

  // Use MongoDB _id if userId is ObjectId, otherwise use userData from query
  // Only use userData if it's loaded (not undefined)
  // If userId is not ObjectId and userData is not loaded yet, userObjectId will be null
  const userObjectId = isMongoObjectId ? userId : (userData ?? null);

  // Only fetch orders when we have a valid userObjectId
  // If userId is not ObjectId, wait for userData to be loaded
  // Pass empty string only if userObjectId is null, hook's enabled will prevent the call
  const {
    profileOrders,
    totals,
    pagination: paginationData,
    isLoading: isLoadingOrders,
    error,
  } = useGetProfileOrders(
    userObjectId ?? '',
    undefined,
    {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    }
  );

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
