const fs = require('fs');
const path = require('path');

// Load .env file if it exists
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';

if (!keyId) {
  console.warn('⚠️  Warning: RAZORPAY_KEY_ID or VITE_RAZORPAY_KEY_ID not set in environment');
  console.warn('   Razorpay will not work without a valid test key');
  console.warn('   Get your key from: https://dashboard.razorpay.com/settings/api-keys');
}

const configContent = `// Razorpay Configuration - Auto-generated at build time
// DO NOT EDIT MANUALLY - This file is generated from environment variables
// For local dev: set RAZORPAY_KEY_ID in .env file
// For Vercel: set RAZORPAY_KEY_ID in Vercel Environment Variables
window.RAZORPAY_KEY_ID = "${keyId}";
`;

const outputPath = path.join(__dirname, 'js', 'config.js');
fs.writeFileSync(outputPath, configContent);

console.log(`✅ Generated ${outputPath}`);
if (keyId) {
  console.log(`   Key: ${keyId.substring(0, 12)}...`);
} else {
  console.log(`   Key: (not set - Razorpay will show error)`);
}