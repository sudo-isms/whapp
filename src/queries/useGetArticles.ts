import { useQuery } from 'react-query';
import { getArticles } from '../api/products';

function useGetArticles() {
  return useQuery<any, any>('articles', getArticles, {
    refetchOnWindowFocus: false,
    retry: 5,
    staleTime: 30000, // 30s
  });
}

export default useGetArticles;
