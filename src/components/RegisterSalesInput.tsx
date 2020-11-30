import * as React from 'react';
import { postSale, updateArticleStock } from '../api/products';
import { useMutation, useQueryCache } from 'react-query';

type Props = {
  productId: string;
  amountSold: number;
  maxAmount: 1;
};

const RegisterSalesInput = ({
  productId,
  amountSold = 1,
  maxAmount = 1,
}: Props) => {
  const queryCache = useQueryCache();

  const [amount, setAmount] = React.useState(amountSold);

  const [updateArticles] = useMutation(updateArticleStock, {
    onSuccess: () => {
      console.info('updateArticles: success');
    },
    onError: () => {
      console.info('updateArticles: error — retrying!');
      updateArticles({ productId: productId, amountSold: amount, queryCache });
    },
  });

  const [registerSale] = useMutation(postSale, {
    onSuccess: () => {
      console.info('registerSale: success');
    },
    onMutate: () => {
      console.info('registerSale: onMutate');
    },

    onError: (err, variables, previousValue) => {
      console.log('registerSale: error');
      // rollback
      // return queryCache.setQueryData('products', previousValue);
    },

    // After success or failure, refetch the query
    onSettled: () => {
      console.log('registerSale: settled');
      queryCache.invalidateQueries('sales');
      queryCache.invalidateQueries('articles');
      queryCache.invalidateQueries('products');
    },
  });

  const handleSale = () => {
    return Promise.all([
      registerSale({ productId: productId, amountSold: amount }),
      updateArticles({ productId: productId, amountSold: amount, queryCache }),
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSale();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        size={4}
        max={maxAmount}
        min={0}
        onChange={(e) => {
          setAmount(parseInt(e.currentTarget.value));
        }}
        disabled={maxAmount < 1}
      />
      <button type="submit" disabled={maxAmount < 1 || amount < 1}>
        Sell
      </button>
    </form>
  );
};

export default RegisterSalesInput;
