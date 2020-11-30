import { amendProductsInStock } from './productUtils';
import { normalizeResponse } from '../../api/helpers';

import rawArticles from './__mocks__/articles.json';
import rawProducts from './__mocks__/products.json';

const articles = normalizeResponse(rawArticles);
const products = normalizeResponse(rawProducts);

describe('queries: amendProductsInStock', () => {
  test('will calculate and amend amountInStock to a product', () => {
    amendProductsInStock(products, articles);

    expect(products).toMatchSnapshot();
  });
});
