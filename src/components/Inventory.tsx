import useGetArticles from '../queries/useGetArticles';
import ResetArticlesButton from './ResetArticlesButton';

const Inventory = () => {
  const {
    data: articles,
    refetch,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetArticles();

  return (
    <section>
      <ResetArticlesButton style={{ float: 'right' }} />
      <h2
        onClick={() => {
          refetch();
        }}
      >
        Inventory{isFetching || isLoading ? ' … ' : ''}
      </h2>
      {isError && (
        <div className="warning-block">
          {`Error: ${error.status} ${error.statusText}`}
        </div>
      )}
      {articles && (
        <ul className="list">
          {articles.allIds.map((productId) => {
            const { name, id, amountInStock } = articles.byId[productId];
            return (
              <li className="list-item" key={`inventory-${id}`}>
                <span className="amount">{amountInStock}</span>
                <strong className="name">{name}</strong>
                <code className="article-id">{id}</code>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Inventory;
