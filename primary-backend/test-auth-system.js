const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1/user';

async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Email/Password Signup
    console.log('1️⃣ Testing Email/Password Signup...');
    const signupData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'CIVILIAN',
      name: 'Test User'
    };

    const signupResponse = await axios.post(`${BASE_URL}/signup`, signupData);
    console.log('✅ Signup successful:', signupResponse.data.message);
    console.log('User created:', signupResponse.data.user);

    // Test 2: Email/Password Login
    console.log('\n2️⃣ Testing Email/Password Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/signin`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User logged in:', loginResponse.data.user);

    // Test 3: Check Email Existence
    console.log('\n3️⃣ Testing Email Check...');
    const checkResponse = await axios.get(`${BASE_URL}/check-email?email=test@example.com`);
    console.log('✅ Email check successful:', checkResponse.data);

    // Test 4: Get User by Email
    console.log('\n4️⃣ Testing Get User by Email...');
    const userResponse = await axios.get(`${BASE_URL}/by-email?email=test@example.com`);
    console.log('✅ Get user successful:', userResponse.data.user);

    // Test 5: Google Signup (simulated)
    console.log('\n5️⃣ Testing Google Signup...');
    const googleSignupData = {
      email: 'google@example.com',
      name: 'Google User',
      image: 'https://example.com/avatar.jpg',
      role: 'POLICE'
    };

    const googleResponse = await axios.post(`${BASE_URL}/google-signup`, googleSignupData);
    console.log('✅ Google signup successful:', googleResponse.data.message);
    console.log('Google user created:', googleResponse.data.user);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Email/Password signup ✅');
    console.log('- Email/Password login ✅');
    console.log('- Email existence check ✅');
    console.log('- Get user by email ✅');
    console.log('- Google signup ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAuthSystem(); 