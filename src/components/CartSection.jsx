// src/components/CartSection.js
import React from 'react';
import { VStack, Divider } from '@chakra-ui/react';
import Cart from './Cart';
import PaymentBreakdown from './PaymentBreakdown';
import APIPayload from './APIPayload';
import CheckoutForm from './CheckoutForm';

function CartSection({
  cart,
  vendors,
  removeFromCart,
  updateQuantity,
  splitOption,
  setSplitOption,
}) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <VStack spacing={6} align="stretch">
      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      <Divider />
      <CheckoutForm
        cart={cart}
        vendors={vendors}
        splitOption={splitOption}
        totalAmount={totalAmount}
      />
    </VStack>
  );
}

export default CartSection;
