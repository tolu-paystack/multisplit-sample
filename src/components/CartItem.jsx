import React from 'react';
import { Flex, Text, Button, IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon, CloseIcon } from '@chakra-ui/icons';

function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <Flex justify="space-between" align="center">
      <Flex direction="column" flex="1">
        <Text fontWeight="bold">{item.name}</Text>
        <Text>₦{item.price.toLocaleString()}</Text>
      </Flex>
      <Flex align="center">
        <IconButton
          size="sm"
          icon={<MinusIcon />}
          onClick={() =>
            updateQuantity(item.id, Math.max(1, item.quantity - 1))
          }
          aria-label="Decrease quantity"
        />
        <Text mx="2">{item.quantity}</Text>
        <IconButton
          size="sm"
          icon={<AddIcon />}
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        />
        <IconButton
          size="sm"
          icon={<CloseIcon />}
          onClick={() => removeFromCart(item.id)}
          ml="2"
          aria-label="Remove item"
        />
      </Flex>
    </Flex>
  );
}

export default CartItem;
