import { useQuery } from 'react-query';
import { getProducts } from '../api/products';

function useGetProducts() {
  return useQuery<any, any>('products', getProducts, {
    refetchOnWindowFocus: false,
    retry: 5,
    staleTime: 30000, // 30s
  });
}

export default useGetProducts;
