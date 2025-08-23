const axios = require('axios');
const WebSocket = require('ws');

// Configuration
const BASE_URL = 'https://alertsystem.akshxdevs.com';
const BACKEND_URL = 'https://emergency-alert-system-bffp.onrender.com/api/v1';
const WS_URL = 'wss://emergency-alert-system-bffp.onrender.com';

// Test data
const testUsers = {
  civilian: {
    email: 'test.civilian@example.com',
    password: 'testpass123',
    name: 'Test Civilian',
    role: 'CIVILIAN'
  },
  police: {
    email: 'test.police@example.com', 
    password: 'testpass123',
    name: 'Test Police Officer',
    role: 'POLICE'
  },
  fire: {
    email: 'test.fire@example.com',
    password: 'testpass123', 
    name: 'Test Firefighter',
    role: 'FIRE'
  },
  medical: {
    email: 'test.medical@example.com',
    password: 'testpass123',
    name: 'Test Medical Staff', 
    role: 'MEDICAL'
  }
};

const testAlert = {
  type: 'CRIME',
  description: 'Test emergency alert from automated testing',
  priority: 'HIGH',
  location: {
    lat: 40.7128,
    long: -74.0060
  }
};

class EmergencyAlertSystemTester {
  constructor() {
    this.testResults = [];
    this.authTokens = {};
    this.userIds = {};
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
    this.testResults.push({ timestamp, type, message });
  }

  async testFrontendAccessibility() {
    this.log('Testing frontend accessibility...');
    
    try {
      const response = await axios.get(BASE_URL, { timeout: 10000 });
      if (response.status === 200) {
        this.log('Frontend is accessible and responding', 'SUCCESS');
        return true;
      } else {
        this.log(`Frontend returned status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`Frontend accessibility test failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testBackendConnectivity() {
    this.log('Testing backend connectivity...');
    
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
      if (response.status === 200) {
        this.log('Backend is accessible and responding', 'SUCCESS');
        return true;
      } else {
        this.log(`Backend returned status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`Backend connectivity test failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testUserRegistration(userType) {
    this.log(`Testing user registration for ${userType}...`);
    
    const user = testUsers[userType];
    
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role
      }, { timeout: 10000 });

      if (response.status === 201 || response.status === 200) {
        this.log(`${userType} registration successful`, 'SUCCESS');
        this.userIds[userType] = response.data.user?.id;
        return true;
      } else {
        this.log(`${userType} registration failed with status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      if (error.response?.status === 409) {
        this.log(`${userType} already exists, proceeding with login`, 'INFO');
        return true;
      } else {
        this.log(`${userType} registration failed: ${error.message}`, 'ERROR');
        return false;
      }
    }
  }

  async testUserLogin(userType) {
    this.log(`Testing user login for ${userType}...`);
    
    const user = testUsers[userType];
    
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, {
        email: user.email,
        password: user.password
      }, { timeout: 10000 });

      if (response.status === 200 && response.data.user) {
        this.log(`${userType} login successful`, 'SUCCESS');
        this.authTokens[userType] = response.data.token;
        this.userIds[userType] = response.data.user.id;
        return true;
      } else {
        this.log(`${userType} login failed with status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`${userType} login failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testAlertReporting() {
    this.log('Testing emergency alert reporting...');
    
    if (!this.authTokens.civilian) {
      this.log('No civilian auth token available for alert reporting', 'ERROR');
      return false;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/alerts/report`, {
        ...testAlert,
        reportedBy: this.userIds.civilian
      }, {
        headers: {
          'Authorization': `Bearer ${this.authTokens.civilian}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 201 || response.status === 200) {
        this.log('Emergency alert reported successfully', 'SUCCESS');
        this.reportedAlertId = response.data.alert?.id;
        return true;
      } else {
        this.log(`Alert reporting failed with status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`Alert reporting failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testWebSocketConnection(userType) {
    this.log(`Testing WebSocket connection for ${userType}...`);
    
    return new Promise((resolve) => {
      const ws = new WebSocket(`${WS_URL}/${this.userIds[userType]}/?${testUsers[userType].role}`);
      
      const timeout = setTimeout(() => {
        this.log(`${userType} WebSocket connection timeout`, 'ERROR');
        ws.close();
        resolve(false);
      }, 10000);

      ws.on('open', () => {
        this.log(`${userType} WebSocket connected successfully`, 'SUCCESS');
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      });

      ws.on('error', (error) => {
        this.log(`${userType} WebSocket connection failed: ${error.message}`, 'ERROR');
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  async testAlertReception(userType) {
    this.log(`Testing alert reception for ${userType}...`);
    
    if (!this.reportedAlertId) {
      this.log('No alert ID available for reception testing', 'ERROR');
      return false;
    }

    return new Promise((resolve) => {
      const ws = new WebSocket(`${WS_URL}/${this.userIds[userType]}/?${testUsers[userType].role}`);
      
      const timeout = setTimeout(() => {
        this.log(`${userType} alert reception test timeout`, 'ERROR');
        ws.close();
        resolve(false);
      }, 15000);

      ws.on('open', () => {
        this.log(`${userType} WebSocket opened for alert reception test`, 'INFO');
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'EMERGENCY_ALERT' || message.type === 'CRIME' || message.type === 'FIRE' || message.type === 'MEDICAL') {
            this.log(`${userType} received emergency alert: ${message.type}`, 'SUCCESS');
            clearTimeout(timeout);
            ws.close();
            resolve(true);
          }
        } catch (error) {
          this.log(`${userType} failed to parse WebSocket message: ${error.message}`, 'ERROR');
        }
      });

      ws.on('error', (error) => {
        this.log(`${userType} WebSocket error during alert reception: ${error.message}`, 'ERROR');
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  async testAlertStatusUpdate() {
    this.log('Testing alert status update...');
    
    if (!this.authTokens.police || !this.reportedAlertId) {
      this.log('No police auth token or alert ID available for status update', 'ERROR');
      return false;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/alerts/${this.reportedAlertId}/status`, {
        status: 'IN_PROCESS'
      }, {
        headers: {
          'Authorization': `Bearer ${this.authTokens.police}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        this.log('Alert status updated successfully', 'SUCCESS');
        return true;
      } else {
        this.log(`Alert status update failed with status ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`Alert status update failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async runComprehensiveTest() {
    this.log('🚨 Starting Comprehensive Emergency Alert System Test 🚨');
    this.log(`Testing deployed system at: ${BASE_URL}`);
    this.log(`Backend URL: ${BACKEND_URL}`);
    this.log(`WebSocket URL: ${WS_URL}`);

    // Test 1: Frontend Accessibility
    const frontendAccessible = await this.testFrontendAccessibility();
    
    // Test 2: Backend Connectivity
    const backendConnected = await this.testBackendConnectivity();

    if (!frontendAccessible || !backendConnected) {
      this.log('Critical infrastructure tests failed. Stopping further tests.', 'ERROR');
      return this.generateReport();
    }

    // Test 3: User Registration and Login
    const userTypes = ['civilian', 'police', 'fire', 'medical'];
    const userTests = [];

    for (const userType of userTypes) {
      const registrationSuccess = await this.testUserRegistration(userType);
      const loginSuccess = await this.testUserLogin(userType);
      userTests.push({ userType, registrationSuccess, loginSuccess });
    }

    // Test 4: Alert Reporting
    const alertReported = await this.testAlertReporting();

    // Test 5: WebSocket Connections
    const wsTests = [];
    for (const userType of userTypes) {
      const wsConnected = await this.testWebSocketConnection(userType);
      wsTests.push({ userType, wsConnected });
    }

    // Test 6: Alert Reception (for relevant roles)
    const receptionTests = [];
    if (alertReported) {
      // Police should receive crime alerts
      const policeReceived = await this.testAlertReception('police');
      receptionTests.push({ userType: 'police', received: policeReceived });

      // Test with a fire alert for fire department
      const fireAlert = { ...testAlert, type: 'FIRE' };
      // This would require additional implementation for fire alert testing
    }

    // Test 7: Alert Status Update
    const statusUpdated = await this.testAlertStatusUpdate();

    this.log('🎯 Comprehensive test completed!');
    return this.generateReport();
  }

  generateReport() {
    this.log('\n📊 TEST SUMMARY REPORT');
    this.log('=' * 50);
    
    const totalTests = this.testResults.length;
    const successTests = this.testResults.filter(r => r.type === 'SUCCESS').length;
    const errorTests = this.testResults.filter(r => r.type === 'ERROR').length;
    const infoTests = this.testResults.filter(r => r.type === 'INFO').length;

    this.log(`Total Tests: ${totalTests}`);
    this.log(`Successful: ${successTests}`);
    this.log(`Errors: ${errorTests}`);
    this.log(`Info: ${infoTests}`);
    this.log(`Success Rate: ${((successTests / totalTests) * 100).toFixed(2)}%`);

    this.log('\n🔍 DETAILED RESULTS:');
    this.testResults.forEach(result => {
      const prefix = result.type === 'ERROR' ? '❌' : result.type === 'SUCCESS' ? '✅' : 'ℹ️';
      console.log(`${prefix} ${result.message}`);
    });

    return {
      totalTests,
      successTests,
      errorTests,
      successRate: (successTests / totalTests) * 100,
      results: this.testResults
    };
  }
}

// Run the test
async function main() {
  const tester = new EmergencyAlertSystemTester();
  const report = await tester.runComprehensiveTest();
  
  console.log('\n🎉 Test execution completed!');
  console.log('Check the results above for any issues that need attention.');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = EmergencyAlertSystemTester; 