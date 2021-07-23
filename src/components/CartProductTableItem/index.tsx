import { MdAddCircleOutline, MdDelete, MdRemoveCircleOutline } from "react-icons/md";

import { formatPrice } from "../../util/format";

import { Row } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
};

interface CartProductTableItemProps {
  product: Product;
  onProductIncrement: (product: Product) => void;
  onProductDecrement: (product: Product) => void;
  onRemoveProduct: (productId: number) => void;
};

export function CartProductTableItem({
  product,
  onProductIncrement,
  onProductDecrement,
  onRemoveProduct
}: CartProductTableItemProps) {
  const priceFormatted = formatPrice(product.price);
  const subTotal = formatPrice(product.price * product.amount);

  return (
    <Row data-testid="product">
      <td>
        <img src={product.image} alt={product.title} />
      </td>
      <td>
        <strong>{product.title}</strong>
        <span>{priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={product.amount <= 1}
            onClick={() => onProductDecrement(product)}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={product.amount}
          />
          <button
            type="button"
            data-testid="increment-product"
          onClick={() => onProductIncrement(product)}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{subTotal}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => onRemoveProduct(product.id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </Row>
  );
};
