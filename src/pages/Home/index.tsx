import { useState, useEffect } from 'react';

import { api } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { ProductListItem } from '../../components/ProductListItem';

import { ProductList } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => ({
    ...sumAmount,
    [product.id]: product.amount
  }), {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get<Product[]>('products');
      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  };

  return (
    <ProductList>
      {products.map(product => (
        <ProductListItem
          key={product.id}
          product={product}
          cartAmount={cartItemsAmount[product.id]}
          onAddProduct={handleAddProduct}
        />
      ))}
    </ProductList>
  );
};

export default Home;
