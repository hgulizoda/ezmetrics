import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { truck } from '../api/truck';
import { ITruckRes } from '../types/truck';
import { IFilterProps } from '../../package/types/Filter';
import { getTrucksAdapter } from '../libs/createNewTruckAdapter';

export const useCreateNewTruck = (onTruckCreate?: (e: ITruckRes) => void) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: {
      name: string;
      created_at: Date;
      estimated_arrival_date: Date;
      container_number?: string;
    }) => truck.create(value),

    onSuccess: (res) => {
      enqueueSnackbar(t('mutate.truckAdded'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      onTruckCreate?.(get(res, 'data.data'));
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { createTruck: mutateAsync, isPending };
};

export const useGetTrucks = (params?: IFilterProps) => {
  const initialData = {
    trucks: [],
    pagination: null,
  };
  const {
    data = initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trucks', params],
    queryFn: () => truck.getAll(params && params),
    select: (res) => ({
      trucks: getTrucksAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination', null),
    }),
  });

  return { data, isLoading, error };
};

interface IHookProps {
  values: {
    name: string;
    created_at: string | Date;
    estimated_arrival_date: string | Date;
    container_number?: string;
  };
  id: string;
}

export const useUpdateNewTruck = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ values, id }: IHookProps) => truck.update(values, id),

    onSuccess: () => {
      enqueueSnackbar(t('mutate.infoUpdate'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { updateTruck: mutateAsync, isPending };
};

export const useDeleteTruck = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => truck.delete(id),

    onSuccess: () => {
      enqueueSnackbar(t('mutate.infoDeleted'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { deleteTruck: mutateAsync, isPending };
};

export const useDeleteTruckMultiple = (truckIDs: string[]) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => Promise.all(truckIDs.map((id: string) => truck.delete(id))),

    onSuccess: () => {
      enqueueSnackbar(t('mutate.infosDeleted'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { deleteTruckMultiple: mutateAsync, multipending: isPending };
};

export const useArchiveTruck = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => truck.archive(id),

    onSuccess: () => {
      enqueueSnackbar(t('mutate.truckArchived'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['truckDetails'],
      });
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { archiveTruck: mutateAsync, archiving: isPending };
};

export const useArchiveTruckMultiple = (truckIDs: string[]) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => Promise.all(truckIDs.map((id: string) => truck.archive(id))),

    onSuccess: () => {
      enqueueSnackbar(t('mutate.trucksArchived'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['trucks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckDetails'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { archiveTruckMultiple: mutateAsync, multiarchiving: isPending };
};
