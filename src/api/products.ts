import { normalizeResponse, sortByCreatedAt } from './helpers';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7000';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// PRODUCTS

export function getProducts() {
  return fetch(apiUrl + '/products')
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then(normalizeResponse);
}

// ARTICLES

export async function getArticles() {
  return fetch(apiUrl + '/articles')
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then(normalizeResponse);
}

// SALES

type Sale = { productId: string; amountSold: number };

export async function getSales() {
  return fetch(apiUrl + '/sales').then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    // sort by createdAt in descending order
    return response.json().then((sales) => {
      if (Array.isArray(sales)) {
        return sales.sort(sortByCreatedAt);
      }
      return sales;
    });
  });
}

export async function postSale({ productId, amountSold }: Sale) {
  return fetch(apiUrl + '/sales', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ productId, amountSold }),
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  });
}

export async function deleteSale(id: string) {
  return fetch(`${apiUrl}/sales/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  });
}

// ARTICLES

export function patchArticles({ articles }) {
  return fetch(apiUrl + '/articles', {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(articles),
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  });
}

// > NOTE: You can only patch `name` and `amountInStock`.
// > You can also use `amountToSubtract` to patch the _amount in stock_.
// > The value provided will be subtracted from`amountInStock`.
//
// Harder to achieve resilient transaction if using `amountToSubtract`,
// given that the api is not stable. Makes it harder to replay a failed mutation.
// Would be preferrable if the backend handled the changes to article stock,
// when receiving a sale, but then it would also make for a less fun assignment.
export function updateArticleStock({ productId, amountSold, queryCache }) {
  const products = queryCache.getQueryData('products');
  const articles = queryCache.getQueryData('articles');

  const product = products.byId[productId];
  let articlesToPatch = [];

  try {
    articlesToPatch = product.articles.map((item) => {
      const { amountInStock: currentAmountInStock, name } =
        articles.byId[item.id] || {};

      const amountInStock =
        currentAmountInStock - item.amountRequired * amountSold;

      if (amountInStock < 0) {
        throw new Error(
          `${name} (${item.id}) will have a negative amount in Stock: ${amountInStock}`
        );
      }

      return {
        id: item.id,
        amountInStock,
      };
    });
  } catch (err) {
    return Promise.reject(err);
  }

  return fetch(apiUrl + '/articles', {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(articlesToPatch),
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  });
}
