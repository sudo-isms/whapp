import * as React from 'react';
// import logo from './logo.svg';
import Logo from './Logo';
import clsx from 'clsx';
import { useQueryCache } from 'react-query';

type Props = {
  isFetching: boolean;
};

const Header = ({ isFetching = false }: Props) => {
  const queryCache = useQueryCache();
  return (
    <header>
      <span
        onClick={() => {
          queryCache.refetchQueries();
        }}
        className={clsx('logo', isFetching && 'loading')}
      >
        <Logo width="48" height="48" />
      </span>
    </header>
  );
};
export default Header;
