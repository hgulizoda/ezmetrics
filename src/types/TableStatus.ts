import { useTranslate } from 'src/locales';

import { LabelColor } from 'src/components/label';

export enum OrderStatus {
  PENDING = 'pending', // Omborga kelishi kutilmoqda
  IN_CHINA_WAREHOUSE = 'in_china_warehouse', // Xitoydagi omborda
  TO_CHINA_BORDER = 'to_china_border', // Xitoy chegarasiga ketdi
  IN_TRANSIT = 'in_transit', // Tranzit zonaga o'tdi (KZ, KG)
  TO_UZB_CUSTOMS = 'to_uzb_customs', // Tranzit zonadan UZB bojxona omborxonasiga yo'lga chiqdi
  IN_CUSTOMS = 'in_customs', // Yuk bojxona omborxonasiga yetib keldi va rasmiylashtiruv jarayoni boshlandi
  DELIVERED = 'delivered', // Bojxona rasmiylashtiruvi yakunlandi va yuk yetkazib berildi
}

export const useShipmentTypeLabels = () => {
  const { t } = useTranslate('lang');
  return {
    [OrderStatus.PENDING]: t('shipmentStatus.pending'),
    [OrderStatus.IN_CHINA_WAREHOUSE]: t('shipmentStatus.inchinawarehouse'),
    [OrderStatus.TO_CHINA_BORDER]: t('shipmentStatus.tochinaborder'),
    [OrderStatus.IN_TRANSIT]: t('shipmentStatus.intransit'),
    [OrderStatus.TO_UZB_CUSTOMS]: t('shipmentStatus.touzbcustoms'),
    [OrderStatus.IN_CUSTOMS]: t('shipmentStatus.incustoms'),
    [OrderStatus.DELIVERED]: t('shipmentStatus.delivered'),
  };
};

export const useShipmentTooltipTypeLabels = () => {
  const { t } = useTranslate('lang');

  return {
    [OrderStatus.PENDING]: t('shipmentTooltip.pending'),
    [OrderStatus.IN_CHINA_WAREHOUSE]: t('shipmentTooltip.inChinaWarehouse'),
    [OrderStatus.TO_CHINA_BORDER]: t('shipmentTooltip.toChinaBorder'),
    [OrderStatus.IN_TRANSIT]: t('shipmentTooltip.inTransit'),
    [OrderStatus.TO_UZB_CUSTOMS]: t('shipmentTooltip.toUzbCustoms'),
    [OrderStatus.IN_CUSTOMS]: t('shipmentTooltip.inCustoms'),
    [OrderStatus.DELIVERED]: t('shipmentTooltip.delivered'),
  };
};

export const ShipmentTypeLabelsColors: Record<OrderStatus | string, LabelColor> = {
  [OrderStatus.PENDING]: 'info',
  [OrderStatus.IN_CHINA_WAREHOUSE]: 'warning',
  [OrderStatus.TO_CHINA_BORDER]: 'primary',
  [OrderStatus.IN_TRANSIT]: 'error',
  [OrderStatus.TO_UZB_CUSTOMS]: 'default',
  [OrderStatus.IN_CUSTOMS]: 'secondary',
  [OrderStatus.DELIVERED]: 'success',
};

export const ShipmentTypeIcons: Record<OrderStatus | string, string> = {
  [OrderStatus.PENDING]: '',
  [OrderStatus.IN_CHINA_WAREHOUSE]: 'twemoji:flag-china',
  [OrderStatus.TO_CHINA_BORDER]: '',
  [OrderStatus.IN_TRANSIT]: '',
  [OrderStatus.TO_UZB_CUSTOMS]: 'twemoji:flag-uzbekistan',
  [OrderStatus.IN_CUSTOMS]: '',
  [OrderStatus.DELIVERED]: '',
};
