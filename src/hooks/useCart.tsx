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
      const product = await getProduct(productId);

      await verifyProductStock(productId, (product.amount + 1));

      const cartProducts = cart.filter(cartProduct => cartProduct.id !== productId);

      product.amount += 1;
      cartProducts.push(product);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartProducts));

      setCart(cartProducts);
    } catch(err) {
      const message = err.message.includes('Quantidade solicitada fora de estoque')
        ? err.message
        : 'Erro na adição do produto';

      toast.error(message);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const cartFiltered = cart.filter(product => product.id !== productId);

      if(cart.length === cartFiltered.length) {
        // Hack to conform test specs
        throw Error('Erro na remoção do produto');
      }

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartFiltered));

      setCart(cartFiltered);
    } catch(err) {
      toast.error(err.message);
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount < 1) return;

      const product = getCartProduct(productId);

      if(!product) {
        throw Error('Erro na alteração de quantidade do produto');
      }

      await verifyProductStock(productId, amount);

      const cartProducts = cart.filter(cartProduct => cartProduct.id !== productId);

      product.amount = amount;
      cartProducts.push(product);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartProducts));

      setCart(cartProducts);
    } catch(err) {
      const message = err.message.includes('Quantidade solicitada fora de estoque')
        ? err.message
        : 'Erro na alteração de quantidade do produto';

        toast.error(message);
    }
  };

  async function verifyProductStock(productId: number, requestedAmount: number): Promise<void> {
    const { data: productStock } = await api.get<Stock>(`stock/${productId}`);

    if(productStock.amount < requestedAmount) {
      throw Error('Quantidade solicitada fora de estoque');
    }
  };

  function getCartProduct(productId: number): (Product | undefined) {
    return cart.find((product => product.id === productId));
  }

  async function getProduct(productId: number): Promise<Product> {
    let product = getCartProduct(productId);

    if(product) return { ...product };

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
