import { useMemo } from 'react';

import { useTranslate } from 'src/locales';

const useSteps = () => {
  const { t } = useTranslate('lang');
  return [
    {
      title: t('shipmentStatus.inchinawarehouse'),
      date: '',
      status: 'in_china_warehouse',
      progress: '',
    },
    {
      title: t('shipmentStatus.tochinaborder'),
      date: '',
      status: 'to_china_border',
      progress: '',
    },
    {
      title: t('shipmentStatus.intransit'),
      date: '',
      status: 'in_transit',
      progress: '',
    },
    {
      title: t('shipmentStatus.touzbcustoms'),
      date: '',
      status: 'to_uzb_customs',
      progress: '',
    },
    {
      title: t('shipmentStatus.incustoms'),
      date: '',
      status: 'in_customs',
      progress: '',
    },
    {
      title: t('shipmentStatus.delivered'),
      date: '',
      status: 'delivered',
      progress: '',
    },
  ];
};

export const useTimelineProgress = (statusHistory: { status: string; date: string }[]) => {
  const steps = useSteps();

  return useMemo(() => {
    const lastStatusIndex = statusHistory.length - 1;
    const lastStatus = statusHistory[lastStatusIndex]?.status;

    const matchingIndex = steps.findIndex((step) => step.status === lastStatus);

    if (matchingIndex === steps.length - 1) {
      return steps.map((step) => ({
        ...step,
        progress: 'completed',
        date: statusHistory.find((history) => history.status === step.status)?.date || '',
      }));
    }

    return steps.map((step, index) => {
      if (index < matchingIndex) {
        return {
          ...step,
          progress: 'completed',
          date: statusHistory.find((history) => history.status === step.status)?.date || '',
        };
      }
      if (index === matchingIndex) {
        return {
          ...step,
          progress: 'current',
          date: statusHistory[lastStatusIndex]?.date || '',
        };
      }
      return {
        ...step,
        progress: 'pending',
        date: '',
      };
    });
  }, [statusHistory, steps]);
};
