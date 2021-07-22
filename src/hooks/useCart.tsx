import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      await verifyProductStock(productId);

      const cartProductItem = await getCartProductItem(productId);

      const cartItem = {
        ...cartProductItem,
        amount: cartProductItem.amount + 1
      };

      const cartItems = cart.filter(item => item.id !== productId);
      cartItems.push(cartItem);

      setCart(cartItems);
    } catch(err) {
      const message = err.message
        ? err.message
        : 'Erro na adição do produto';

      toast.error(message);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const cartFiltered = cart.filter(product => product.id !== productId);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartFiltered));

      setCart(cartFiltered);
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  async function verifyProductStock(productId: number): Promise<void> {
    const { data: productStock } = await api.get<Stock>(`stock/${productId}`);

    if(productStock.amount < 1) {
      throw Error('Quantidade solicitada fora de estoque');
    }
  };

  async function getCartProductItem(productId: number): Promise<Product> {
    let cartProduct = cart.find((cartProd => cartProd.id === productId));

    if(cartProduct) return cartProduct;

    const { data } = await api.get(`products/${productId}`);

    return { ...data, amount: 0 };
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
