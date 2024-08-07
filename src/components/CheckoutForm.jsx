// src/components/CheckoutForm.js
import React, { useState } from 'react';
import { Box, VStack, Input, Button, Text, useToast } from '@chakra-ui/react';
import { usePaystackPayment } from 'react-paystack';

const PAYSTACK_PUBLIC_KEY = 'your_paystack_public_key_here';

function CheckoutForm({ cart, vendors, splitOption, totalAmount }) {
  const [email, setEmail] = useState('');
  const toast = useToast();

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

  const handlePaymentSuccess = (reference) => {
    toast({
      title: 'Payment Successful',
      description: `Reference: ${reference}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handlePaymentClose = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'You have cancelled the payment.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    initializePayment(handlePaymentSuccess, handlePaymentClose);
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: totalAmount * 100, // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    split: {
      type: splitOption,
      subaccounts: vendors
        .filter((vendor) =>
          cart.some((item) => vendor.products.some((p) => p.id === item.id))
        )
        .map((vendor) => ({
          subaccount: vendor.subaccount.subaccount_code,
          share: calculateVendorShare(vendor),
        })),
      bearer_type: splitOption === 'account' ? 'account' : 'all-proportional',
      bearer_subaccount:
        splitOption === 'subaccount'
          ? vendors[0]?.subaccount?.subaccount_code
          : null,
    },
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <Box as="form" onSubmit={onSubmit}>
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Checkout
        </Text>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" colorScheme="blue" isDisabled={cart.length === 0}>
          Pay ₦{totalAmount.toLocaleString()}
        </Button>
      </VStack>
    </Box>
  );
}

export default CheckoutForm;
