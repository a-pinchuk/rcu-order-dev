import React, { useEffect, useState } from 'react';
// import './App.css';

import axios from 'axios';
import { ProductTable } from './ProductsTable/ProductsTable';

export const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/api/products');

      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <ProductTable products={products} />
    </div>
  );
};

export default App;
