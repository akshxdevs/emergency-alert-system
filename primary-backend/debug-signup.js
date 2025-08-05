const { prismaClient } = require('./dist/db/db');
const bcrypt = require('bcrypt');

async function debugSignup() {
  try {
    console.log('🔍 Debugging signup...');
    
    const testData = {
      email: 'debug@example.com',
      password: 'password123',
      role: 'CIVILIAN',
      name: 'Debug User'
    };

    console.log('Test data:', testData);

    // Check if user exists
    const existingUser = await prismaClient.user.findFirst({
      where: { email: testData.email }
    });

    if (existingUser) {
      console.log('❌ User already exists');
      return;
    }

    // Generate username
    const generateUsername = String(
      testData.role + Math.floor(Math.random() * 1000000)
    ).padStart(6, "7");

    console.log('Generated username:', generateUsername);

    // Hash password
    const hashedPassword = await bcrypt.hash(testData.password, 10);
    console.log('Password hashed successfully');

    // Create user
    const user = await prismaClient.user.create({
      data: {
        username: generateUsername,
        email: testData.email,
        password: hashedPassword,
        role: testData.role,
        name: testData.name || generateUsername,
      },
    });

    console.log('✅ User created successfully:', user);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prismaClient.$disconnect();
  }
}

debugSignup(); 