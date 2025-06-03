import { useParams } from 'react-router';

import SingleAutoPrices from 'src/modules/price/ui/singleauto/Table';
import { useGetPriceByid } from 'src/modules/price/hook/useGetPriceByid';

import { NoData } from 'src/components/no-data copy/no-data';
import { ErrorData } from 'src/components/error-data/error-data';
import Circular from 'src/components/loading-screen/circular-screen';

const SingleAutoPriceRoot = () => {
  const params = useParams() as { id: string };
  const { data, error, isLoading } = useGetPriceByid(params.id);
  if (isLoading) return <Circular />;
  if (error) return <ErrorData />;
  if (!data) return <NoData />;
  return <SingleAutoPrices data={data} />;
};

export default SingleAutoPriceRoot;
