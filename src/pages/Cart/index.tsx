import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { CartProductTableItem } from '../../components/CartProductTableItem';

import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const total = cart.reduce((sumTotal, product) => (
    sumTotal + product.amount * product.price
  ), 0);

  const totalFormatted = formatPrice(total);

  function handleProductIncrement(product: Product) {
    updateProductAmount({
      productId: product.id,
      amount: (product.amount + 1)
    });
  };

  function handleProductDecrement(product: Product) {
    updateProductAmount({
      productId: product.id,
      amount: (product.amount - 1)
    });
  };

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  };

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <CartProductTableItem
              key={product.id}
              product={product}
              onProductDecrement={handleProductDecrement}
              onProductIncrement={handleProductIncrement}
              onRemoveProduct={handleRemoveProduct}
            />
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{totalFormatted}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
