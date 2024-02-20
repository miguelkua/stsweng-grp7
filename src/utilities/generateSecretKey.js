const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
  return secretKey;
};

// Print the generated secret key
console.log('Generated Secret Key:', generateSecretKey());

// Generated Secret Key: 8e1c5ec92dd02a86687f07a4e22a20be4073325debc60a80dca357d2afbcf362