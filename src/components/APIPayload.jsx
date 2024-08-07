// src/components/APIPayload.js
import React from 'react';
import { Box, Text, Code, Divider } from '@chakra-ui/react';

import PaymentBreakdown from './PaymentBreakdown';

function APIPayload({
  cart,
  vendors,
  splitOption,
  setSplitOption,
  totalAmount,
}) {
  const generatePayload = () => {
    const payload = {
      amount: totalAmount * 100, // Convert to kobo
      email: 'customer@example.com', // This would be dynamically set in a real scenario
      split: {
        type: 'flat',
        bearer_type: splitOption,
        subaccounts: vendors
          .filter((vendor) =>
            cart.some((item) => vendor.products.some((p) => p.id === item.id))
          )
          .map((vendor) => ({
            subaccount: vendor.subaccount.subaccount_code,
            share: calculateVendorShare(vendor),
          })),
      },
    };
    return JSON.stringify(payload, null, 2);
  };

  const calculateVendorShare = (vendor) => {
    const vendorItems = cart.filter((item) =>
      vendor.products.some((p) => p.id === item.id)
    );
    const vendorTotal = vendorItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return Math.round(vendorTotal * (1 - vendor.commission) * 100); // Convert to kobo and round
  };

  return (
    <Box>
      <PaymentBreakdown
        cart={cart}
        vendors={vendors}
        splitOption={splitOption}
        setSplitOption={setSplitOption}
      />
      <Divider />
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Paystack API Payload
      </Text>
      <Code width="100%" p="4" borderRadius="md" whiteSpace="pre-wrap">
        {generatePayload()}
      </Code>
    </Box>
  );
}

export default APIPayload;
