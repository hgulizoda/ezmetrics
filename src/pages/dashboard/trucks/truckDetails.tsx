import React from 'react';
import { useLocation } from 'react-router-dom';

import { TruckOrders } from '../../../modules/trucks/ui/truckDetails/TruckDetails';

const TruckOrderRoot = () => {
  const location = useLocation();
  switch (true) {
    case location.pathname.includes('tranzit-zone'):
      break;
    case location.pathname.includes('china-border'):
      break;
    case location.pathname.includes('uzb-customs'):
      break;
    case location.pathname.includes('customs'):
      break;
    case location.pathname.includes('delivered'):
      break;
    default:
      break;
  }

  return <TruckOrders />;
};

export default TruckOrderRoot;
