import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const savedCart = Cookies.get('cart');
    const guestStatus = Cookies.get('isGuest');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (guestStatus) setIsGuest(JSON.parse(guestStatus));
  }, []);

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, quantity }];
      return updatedCart;
    });
  };

  const getItem = (productId) => {
    return cart.find((item) => item.id === productId);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id === productId) {
          const newQty = item.quantity - 1;
          return newQty > 0 ? [{ ...item, quantity: newQty }] : [];
        }
        return [item];
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setIsGuest(false);
    Cookies.remove('cart');
    Cookies.remove('isGuest');
  };

  const checkoutAsGuest = () => {
    setIsGuest(true);
    Cookies.set('isGuest', 'true', { expires: 1 });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getItem,
        updateQuantity,
        removeItem,
        decreaseQuantity,
        clearCart,
        isGuest,
        checkoutAsGuest,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };
