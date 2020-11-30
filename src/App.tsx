import * as React from 'react';
import { useIsFetching } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductList from './components/ProductList';
import Inventory from './components/Inventory';
import SalesList from './components/SalesList';

import './styles/base.css';
import './styles/layout.css';
import './styles/effects.css';
import './styles/header.css';

function App() {
  const isFetching = useIsFetching();

  return (
    <>
      <Header isFetching={!!isFetching} />
      <main>
        <ProductList />
        <SalesList />
        <Inventory />
      </main>
      <Footer />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
