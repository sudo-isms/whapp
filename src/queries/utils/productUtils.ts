// amends the amountInStock property to the products
// after fetching data. This could very well be broken out into
// a computed value, but this way is quite convenient if we often
// want to display just the product listing, sans articles
export function amendProductsInStock(products, articles) {
  if (!products || !articles) return false;
  products.allIds.forEach((productId) => {
    const product = products.byId[productId];
    if (!product) {
      return false;
    }

    let amountInStock = null;

    // Articles related to a product === part
    product.articles.some((part) => {
      const availableArticles = articles.byId[part.id].amountInStock;
      // if the part is not in stock, we can't assemble the product
      if (availableArticles === 0) {
        amountInStock = 0;
        return true;
      }
      const partCount = Math.floor(availableArticles / part.amountRequired);
      if (amountInStock === null || partCount < amountInStock) {
        amountInStock = partCount;
      }
      return false;
    });

    product.amountInStock = amountInStock;
  });
  return products;
}
