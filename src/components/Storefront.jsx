// src/components/Storefront.js
import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ProductCard from './ProductCard';

function Storefront({ vendors, addToCart }) {
  const allProducts = vendors.flatMap((vendor) =>
    vendor.products.map((product) => ({ ...product, vendorName: vendor.name }))
  );

  return (
    <SimpleGrid columns={3} spacing={4}>
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </SimpleGrid>
  );
}

export default Storefront;
