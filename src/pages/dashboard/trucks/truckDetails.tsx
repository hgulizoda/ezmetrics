import React from 'react';
import { useLocation } from 'react-router-dom';

import { TruckOrders } from '../../../modules/trucks/ui/truckDetails/TruckDetails';

const TruckOrderRoot = () => {
  const location = useLocation();
  let status;
  switch (true) {
    case location.pathname.includes('tranzit-zone'):
      status = 'in_transit';
      break;
    case location.pathname.includes('china-border'):
      status = 'to_china_border';
      break;
    case location.pathname.includes('uzb-customs'):
      status = 'to_uzb_customs';
      break;
    case location.pathname.includes('customs'):
      status = 'in_customs';
      break;
    case location.pathname.includes('delivered'):
      status = 'delivered';
      break;
    default:
      status = 'default_status';
  }

  return <TruckOrders status={status} />;
};

export default TruckOrderRoot;
