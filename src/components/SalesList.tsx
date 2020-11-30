import * as React from 'react';
import clsx from 'clsx';

import { useMutation, useQueryCache } from 'react-query';
import { deleteSale } from '../api/products';

import Warning from '../components/layout/Warning';
import useGetSales from '../queries/useGetSales';
import useGetProducts from '../queries/useGetProducts';

function formatTimestamp(createdAt: string) {
  const [date, time] = createdAt.split('T');
  return `${date} ${time.split('.')[0]}`;
}

type Sale = {
  id: string;
  createdAt: string;
  productId: string;
  amountSold?: number;
};

const SaleItem = ({ id, createdAt, productId, amountSold }: Sale) => {
  const queryCache = useQueryCache();

  // Get the product title for the sale.
  // the query fetches product data automatically, if not available already
  const { data: products } = useGetProducts();
  const productName = products?.byId[productId]?.name || '··';

  const [removeSale, { isLoading, isError }] = useMutation(
    () => deleteSale(id),
    {
      onSuccess: () => {
        queryCache.invalidateQueries('sales');
      },
      onMutate: () => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        queryCache.cancelQueries('sales');

        // Snapshot previous state
        const previousSales = queryCache.getQueryData('sales');

        // Optimistically update, ie. remove the Sale from the list
        queryCache.setQueryData('sales', (previousSales: Sale[]) =>
          previousSales.filter((sale) => id !== sale.id)
        );

        // Return the snapshotted value (it gets passed on to onError and onSettled)
        return () => queryCache.setQueryData('sales', previousSales);
      },
      // If the mutation fails, roll back to the state passed on from onMutate
      onError: (err, newSale, rollback: Function) => {
        console.info('removeSale: error — rollback()');
        return rollback();
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryCache.invalidateQueries('sales');
      },
    }
  );

  return (
    <div
      className={clsx(
        'list-item',
        isLoading && 'pending-removal',
        isError && 'error-removal'
      )}
    >
      <span className="amount">{amountSold}</span>
      <strong className="name">{productName}</strong>
      <span className="date">{formatTimestamp(createdAt)} </span>
      <button
        type="button"
        title="click to remove this sales item"
        disabled={!!isLoading}
        onClick={() => {
          removeSale();
        }}
      >
        ×
      </button>
      {isError && <Warning />}
    </div>
  );
};

const SalesList = () => {
  const query = useGetSales();
  const { data } = query;

  return (
    <section>
      <h2
        title="click to refetch sales data"
        onClick={() => {
          query.refetch();
        }}
      >
        $ales {query.isLoading || query.isFetching ? ' …' : ''}
      </h2>
      {data && (
        <div className="list">
          {data.map((sale) => (
            <SaleItem key={sale.id} {...sale} />
          ))}
          {data && data.length === 0 && (
            <p className="dim">
              No sales registered … get out there and move some furniture!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default SalesList;
