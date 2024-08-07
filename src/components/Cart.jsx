import React from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import CartItem from './CartItem';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb="4">
          Your Cart
        </Text>
        <Text>Your cart is empty.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Your Cart
      </Text>
      <VStack spacing="4" align="stretch" mb="4">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        ))}
      </VStack>
      <Box borderTopWidth="1px" pt="4">
        <Text fontWeight="bold">
          Total: ₦{totalPrice.toLocaleString()} ({totalItems} items)
        </Text>
      </Box>
    </Box>
  );
}

export default Cart;
