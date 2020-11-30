import { useMutation, useQueryCache } from 'react-query';
import { patchArticles } from '../api/products';
import Warning from '../components/layout/Warning';

// A quick-restore inventory to original state for development purposes
import originalArticles from '../api/data/articles.json';

const ResetArticlesButton = (props) => {
  const queryCache = useQueryCache();

  const [updateArticles, { isLoading, isError }] = useMutation(patchArticles, {
    onSuccess: () => {
      queryCache.refetchQueries(['articles']);
    },
  });

  const resetArticleInventory = () => {
    return updateArticles({ articles: originalArticles });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetArticleInventory();
        }}
        disabled={isLoading}
        {...props}
      >
        Restore article inventory
      </button>
      {isError && <Warning />}
    </>
  );
};

export default ResetArticlesButton;
