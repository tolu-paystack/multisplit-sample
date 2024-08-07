import React from 'react';
import { Box, Image, Text, Button, VStack } from '@chakra-ui/react';

function ProductCard({ product, vendorName, addToCart }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={product.image} alt={product.name} />
      <VStack p="4" align="start" spacing="2">
        <Text fontWeight="bold">{product.name}</Text>
        <Text>₦{product.price.toLocaleString()}</Text>
        <Text fontSize="sm" color="gray.500">
          Sold by {vendorName}
        </Text>
        <Button colorScheme="blue" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </VStack>
    </Box>
  );
}

export default ProductCard;
