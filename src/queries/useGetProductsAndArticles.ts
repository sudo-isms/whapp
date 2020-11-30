import useGetArticles from './useGetArticles';
import useGetProducts from './useGetProducts';
import { amendProductsInStock } from './utils/productUtils';

function useGetProductsAndArticles() {
  const articlesQuery = useGetArticles();
  const productsQuery = useGetProducts();

  const products = productsQuery.data;
  const articles = articlesQuery.data;

  // add amountInStock on products
  amendProductsInStock(products, articles);

  const refetch = () => {
    return Promise.all([articlesQuery.refetch(), productsQuery.refetch()]);
  };

  return {
    products,
    articles,

    isLoading: articlesQuery.isLoading || productsQuery.isLoading,
    isFetching: articlesQuery.isFetching || productsQuery.isFetching,
    isError: articlesQuery.isError || productsQuery.isError,
    error: articlesQuery.error || productsQuery.error,
    refetch,
  };
}

export default useGetProductsAndArticles;
