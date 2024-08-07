// src/utils/seedScript.js
const axios = require('axios');
const fs = require('fs');

const PAYSTACK_SECRET_KEY = 'sk_test_dda3c77f2032a2a643f6dd200384318755bfad51';
const PAYSTACK_API_URL = 'https://api.paystack.co';

const vendors = [
  { name: 'TechGadgets', commission: 0.12 },
  { name: 'FashionHub', commission: 0.12 },
  { name: 'HomeEssentials', commission: 0.12 },
];

const products = [
  { name: 'Smartphone', price: 150000 },
  { name: 'Laptop', price: 350000 },
  { name: 'Wireless Earbuds', price: 25000 },
  { name: 'T-shirt', price: 5000 },
  { name: 'Jeans', price: 15000 },
  { name: 'Sneakers', price: 20000 },
  { name: 'Coffee Maker', price: 30000 },
  { name: 'Blender', price: 15000 },
  { name: 'Toaster', price: 10000 },
];

async function createSubaccount(vendorName) {
  try {
    const response = await axios.post(
      `${PAYSTACK_API_URL}/subaccount`,
      {
        business_name: vendorName,
        settlement_bank: '058',
        account_number: '0017838651',
        percentage_charge: 12,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error creating subaccount for ${vendorName}:`,
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function generateData() {
  const vendorsWithSubaccounts = await Promise.all(
    vendors.map(async (vendor) => {
      const subaccount = await createSubaccount(vendor.name);
      return {
        ...vendor,
        subaccount: subaccount
          ? {
              id: subaccount.id,
              subaccount_code: subaccount.subaccount_code,
            }
          : null,
        products: products
          .slice(vendors.indexOf(vendor) * 3, vendors.indexOf(vendor) * 3 + 3)
          .map((product) => ({
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            image: `https://picsum.photos/seed/${product.name}/200/200`,
          })),
      };
    })
  );

  fs.writeFileSync(
    'src/data/vendorsAndProducts.json',
    JSON.stringify(vendorsWithSubaccounts, null, 2)
  );
  console.log('Data generated and saved to src/data/vendorsAndProducts.json');
}

generateData();
