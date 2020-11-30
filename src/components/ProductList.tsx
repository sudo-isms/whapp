import * as React from 'react';
import { useQueryCache } from 'react-query';
import useGetProductsAndArticles from '../queries/useGetProductsAndArticles';
import RegisterSalesInput from './RegisterSalesInput';

const ProductList = () => {
  const queryCache = useQueryCache();
  const query = useGetProductsAndArticles();
  const { products, articles } = query;

  return (
    <section>
      <h2
        onClick={() => {
          query.refetch();
        }}
      >
        Products{query.isFetching ? ' … ' : ''}
      </h2>
      {query.isError && (
        <div className="warning-block">
          <p>
            Oops! Something went wrong.{' '}
            <button
              type="button"
              onClick={() => {
                queryCache.refetchQueries();
              }}
            >
              Reload
            </button>
          </p>
          <p>
            <small>{`Error: ${query.error?.status} ${query.error?.statusText}`}</small>
          </p>
        </div>
      )}
      <div className="list">
        {products?.allIds.map((productId) => {
          const {
            name,
            id,
            articles: productArticles = [],
            amountInStock = '--',
          } = products.byId[productId];
          return (
            <React.Fragment key={`product-article-${id}`}>
              <div className="list-item" key={`product-article-${id}`}>
                <span
                  title="this is how many products we can assemble with the articles in stock"
                  className="amount dim"
                >
                  {amountInStock}
                </span>
                <strong className="name">{name}</strong>
                <RegisterSalesInput
                  productId={productId}
                  amountSold={1}
                  maxAmount={amountInStock}
                />
              </div>
              {articles && (
                <ul className="product-articles">
                  {productArticles.map((article) => {
                    const art = articles.byId[article.id];
                    return (
                      <li key={`${productId}-${article.id}`}>
                        <span className="amount">{article.amountRequired}</span>
                        <span className="name">{art.name}</span>
                        <span className="in-stock">
                          in stock: {art.amountInStock}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
