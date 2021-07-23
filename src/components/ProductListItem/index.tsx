import { MdAddShoppingCart } from "react-icons/md";

import { formatPrice } from '../../util/format';

import { ListItem } from "./styles";

interface ProductListItemProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  cartAmount: number;
  onAddProduct: (productId: number) => void;
}

export function ProductListItem({ product, cartAmount = 0, onAddProduct }: ProductListItemProps) {
  const priceFormatted = formatPrice(product.price);

  return (
    <ListItem>
      <img src={product.image} alt={product.title} />
      <strong>{product.title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => onAddProduct(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {cartAmount}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </ListItem>
  );
};
