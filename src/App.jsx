// src/App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';

import vendorsData from './data/vendorsAndProducts.json';

import Storefront from './components/Storefront';
import CartSection from './components/CartSection';
import APIPayload from './components/APIPayload';

function App() {
  const [vendors] = useState(vendorsData);
  const [cart, setCart] = useState([]);
  const [splitOption, setSplitOption] = useState('all');

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <ChakraProvider>
      <Box margin="0 auto" padding={['10px', '20px']}>
        <Flex
          direction={['column', 'column', 'row']}
          gap={6}
          height="calc(100vh - 40px)"
        >
          <Box width={['100%', '100%', '40%']} overflowY="auto">
            <Storefront vendors={vendors} addToCart={addToCart} />
          </Box>
          <Box
            width={['100%', '100%', '40%']}
            overflowY="auto"
            maxHeight={['auto', 'auto', '100%']}
            borderLeft="1px"
            borderRight="1px"
            borderColor="gray.200"
            padding={['10px', '20px']}
          >
            <APIPayload
              cart={cart}
              vendors={vendors}
              splitOption={splitOption}
              setSplitOption={setSplitOption}
              totalAmount={totalAmount}
            />
          </Box>
          <Box
            width={['100%', '100%', '20%']}
            overflowY="auto"
            padding={['10px', '20px']}
          >
            <CartSection
              cart={cart}
              vendors={vendors}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              splitOption={splitOption}
              setSplitOption={setSplitOption}
            />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
