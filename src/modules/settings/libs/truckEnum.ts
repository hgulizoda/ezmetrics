import { useTranslate } from 'src/locales';

export enum TruckStatus {
  NEW = 'new',
  IN_CHINA_WAREHOUSE = 'in_china_warehouse',
  TO_CHINA_BORDER = 'to_china_border',
  IN_TRANSIT = 'in_transit',
  TO_UZB_CUSTOMS = 'to_uzb_customs',
  IN_CUSTOMS = 'in_customs',
  DELIVERED = 'delivered',
}

export const useTruckEnumLabels = () => {
  const { t } = useTranslate('lang');
  return {
    [TruckStatus.NEW]: t('shipmentStatus.new'),
    [TruckStatus.IN_CHINA_WAREHOUSE]: t('shipmentStatus.inchinawarehouse'),
    [TruckStatus.TO_CHINA_BORDER]: t('shipmentStatus.tochinaborder'),
    [TruckStatus.IN_TRANSIT]: t('shipmentStatus.intransit'),
    [TruckStatus.TO_UZB_CUSTOMS]: t('shipmentStatus.touzbcustoms'),
    [TruckStatus.IN_CUSTOMS]: t('shipmentStatus.incustoms'),
    [TruckStatus.DELIVERED]: t('shipmentStatus.delivered'),
  };
};

export const TruckTypeIcons: Record<TruckStatus | string, string> = {
  [TruckStatus.NEW]: '',
  [TruckStatus.IN_CHINA_WAREHOUSE]: 'twemoji:flag-china',
  [TruckStatus.TO_CHINA_BORDER]: '',
  [TruckStatus.IN_TRANSIT]: '',
  [TruckStatus.TO_UZB_CUSTOMS]: 'twemoji:flag-uzbekistan',
  [TruckStatus.IN_CUSTOMS]: '',
  [TruckStatus.DELIVERED]: '',
};
