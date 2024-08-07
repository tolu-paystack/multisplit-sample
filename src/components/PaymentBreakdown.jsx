// src/components/PaymentBreakdown.js
import React from 'react';
import { Box, VStack, Text, Divider, Select } from '@chakra-ui/react';

function PaymentBreakdown({ cart, vendors, splitOption, setSplitOption }) {
  if (!vendors || vendors.length === 0 || cart.length === 0) {
    return <Box>Add items to the cart to see payment breakdown.</Box>;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate Paystack fee
  const calculatePaystackFee = (amount) => {
    const baseFee = amount * 0.015;
    const additionalFee = amount > 2500 ? 100 : 0;
    return Math.min(baseFee + additionalFee, 2000);
  };

  const paystackFee = calculatePaystackFee(totalAmount);

  // Calculate vendor splits
  const vendorSplits = vendors.reduce((splits, vendor) => {
    const vendorTotal = cart.reduce((sum, item) => {
      if (vendor.products.some((p) => p.id === item.id)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);

    if (vendorTotal > 0) {
      splits[vendor.name] = {
        total: vendorTotal,
        commission: vendorTotal * vendor.commission,
        vendorShare: vendorTotal * (1 - vendor.commission),
      };
    }
    return splits;
  }, {});

  // Calculate marketplace split
  const marketplaceSplit = Object.values(vendorSplits).reduce(
    (sum, { commission }) => sum + commission,
    0
  );

  // Adjust splits based on split option
  const adjustSplits = () => {
    let adjustedSplits = {
      ...vendorSplits,
      Marketplace: { total: marketplaceSplit },
    };
    const totalSplit = Object.values(adjustedSplits).reduce(
      (sum, { total }) => sum + total,
      0
    );

    let feeDistribution;
    switch (splitOption) {
      case 'all':
        feeDistribution = Object.fromEntries(
          Object.keys(adjustedSplits).map((key) => [
            key,
            paystackFee / Object.keys(adjustedSplits).length,
          ])
        );
        break;
      case 'all-proportional':
        feeDistribution = Object.fromEntries(
          Object.entries(adjustedSplits).map(([key, { total }]) => [
            key,
            (total / totalSplit) * paystackFee,
          ])
        );
        break;
      case 'account':
        feeDistribution = { Marketplace: paystackFee };
        break;
    }

    return Object.fromEntries(
      Object.entries(adjustedSplits).map(([key, value]) => [
        key,
        {
          ...value,
          paystackFee: feeDistribution[key] || 0,
          finalAmount:
            (value.vendorShare || value.total) - (feeDistribution[key] || 0),
        },
      ])
    );
  };

  const finalSplits = adjustSplits();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Payment Breakdown
      </Text>
      <VStack align="stretch" spacing="4">
        <Text>Total Amount: ₦{totalAmount.toLocaleString()}</Text>
        <Text>Paystack Fee: ₦{paystackFee.toLocaleString()}</Text>
        <Divider />
        <Box>
          <Text fontWeight="bold" mb="2">
            Select Split Option:
          </Text>
          <Select
            value={splitOption}
            onChange={(e) => setSplitOption(e.target.value)}
          >
            <option value="all">All (Split equally)</option>
            <option value="all-proportional">All Proportional</option>
            <option value="account">Account (Marketplace bears fee)</option>
          </Select>
        </Box>
        <Divider />
        <Text fontWeight="bold">Splits:</Text>
        {Object.entries(finalSplits).map(
          ([
            name,
            { total, commission, vendorShare, paystackFee, finalAmount },
          ]) => (
            <Box key={name} mb="4">
              <Text fontWeight="bold">{name}:</Text>
              {name !== 'Marketplace' ? (
                <Text ml="4">
                  Vendor Share: ₦{vendorShare.toLocaleString()} (₦
                  {total.toLocaleString()} - ₦{commission.toLocaleString()}{' '}
                  marketplace commission)
                </Text>
              ) : (
                <Text ml="4">Marketplace Share: ₦{total.toLocaleString()}</Text>
              )}
              <Text ml="4">
                Paystack Fee: -₦{paystackFee.toLocaleString()} ({splitOption}{' '}
                split)
                <br />
                Final Amount: ₦{finalAmount.toLocaleString()}
              </Text>
            </Box>
          )
        )}
      </VStack>
    </Box>
  );
}

export default PaymentBreakdown;
