import { useQuery } from 'react-query';
import { getSales } from '../api/products';

function useGetSales() {
  return useQuery<any, any>('sales', getSales, {
    refetchOnWindowFocus: false,
    retry: 5,
  });
}

export default useGetSales;
