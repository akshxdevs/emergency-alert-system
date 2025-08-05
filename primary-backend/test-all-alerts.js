const WebSocket = require('ws');

// Test all emergency alert types
const testAllAlerts = () => {
  console.log('🚀 Starting comprehensive alert test...');
  
  // Test Police Alert (Crime)
  setTimeout(() => testPoliceAlert(), 1000);
  
  // Test Fire Alert
  setTimeout(() => testFireAlert(), 3000);
  
  // Test Medical Alert
  setTimeout(() => testMedicalAlert(), 5000);
  
  // Test Accident Alert (Police)
  setTimeout(() => testAccidentAlert(), 7000);
};

const testPoliceAlert = () => {
  console.log('\n🚔 Testing Police Alert (Crime)...');
  const ws = new WebSocket('ws://localhost:5000/test-civilian/?CIVILIAN');
  
  ws.on('open', () => {
    const policeAlert = {
      type: "NEW_ALERT",
      payload: {
        type: "CRIME",
        priority: "HIGH",
        status: "REPORTED",
        description: "Test crime incident",
        assignedTo: "POLICE",
        location: {
          lat: 40.7128,
          long: -74.0060
        }
      }
    };
    
    console.log('📤 Sending police alert:', policeAlert);
    ws.send(JSON.stringify(policeAlert));
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Police alert response:', message);
    
    if (message.type === 'success') {
      console.log('✅ Police alert sent successfully!');
    }
    
    setTimeout(() => ws.close(), 2000);
  });
};

const testFireAlert = () => {
  console.log('\n🚒 Testing Fire Alert...');
  const ws = new WebSocket('ws://localhost:5000/test-civilian/?CIVILIAN');
  
  ws.on('open', () => {
    const fireAlert = {
      type: "NEW_ALERT",
      payload: {
        type: "FIRE",
        priority: "HIGH",
        status: "REPORTED",
        description: "Test fire emergency",
        assignedTo: "FIRE",
        location: {
          lat: 40.7589,
          long: -73.9851
        }
      }
    };
    
    console.log('📤 Sending fire alert:', fireAlert);
    ws.send(JSON.stringify(fireAlert));
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Fire alert response:', message);
    
    if (message.type === 'success') {
      console.log('✅ Fire alert sent successfully!');
    }
    
    setTimeout(() => ws.close(), 2000);
  });
};

const testMedicalAlert = () => {
  console.log('\n🚑 Testing Medical Alert...');
  const ws = new WebSocket('ws://localhost:5000/test-civilian/?CIVILIAN');
  
  ws.on('open', () => {
    const medicalAlert = {
      type: "NEW_ALERT",
      payload: {
        type: "MEDICAL",
        priority: "HIGH",
        status: "REPORTED",
        description: "Test medical emergency",
        assignedTo: "MEDICAL",
        location: {
          lat: 40.7505,
          long: -73.9934
        }
      }
    };
    
    console.log('📤 Sending medical alert:', medicalAlert);
    ws.send(JSON.stringify(medicalAlert));
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Medical alert response:', message);
    
    if (message.type === 'success') {
      console.log('✅ Medical alert sent successfully!');
    }
    
    setTimeout(() => ws.close(), 2000);
  });
};

const testAccidentAlert = () => {
  console.log('\n🚨 Testing Accident Alert (Police)...');
  const ws = new WebSocket('ws://localhost:5000/test-civilian/?CIVILIAN');
  
  ws.on('open', () => {
    const accidentAlert = {
      type: "NEW_ALERT",
      payload: {
        type: "ACCIDENT",
        priority: "MEDIUM",
        status: "REPORTED",
        description: "Test accident incident",
        assignedTo: "POLICE",
        location: {
          lat: 40.7484,
          long: -73.9857
        }
      }
    };
    
    console.log('📤 Sending accident alert:', accidentAlert);
    ws.send(JSON.stringify(accidentAlert));
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Accident alert response:', message);
    
    if (message.type === 'success') {
      console.log('✅ Accident alert sent successfully!');
    }
    
    setTimeout(() => ws.close(), 2000);
  });
};

// Test role-specific listeners
const testRoleListeners = () => {
  console.log('\n👥 Testing Role-Specific Listeners...');
  
  // Police listener
  const policeWs = new WebSocket('ws://localhost:5000/police-officer/?POLICE');
  policeWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
      console.log('🚔 Police received alert:', message);
    }
  });
  
  // Fire listener
  const fireWs = new WebSocket('ws://localhost:5000/firefighter/?FIRE');
  fireWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === 'FIRE') {
      console.log('🚒 Fire received alert:', message);
    }
  });
  
  // Medical listener
  const medicalWs = new WebSocket('ws://localhost:5000/medic/?MEDICAL');
  medicalWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === 'MEDICAL') {
      console.log('🚑 Medical received alert:', message);
    }
  });
  
  // Keep listeners alive for 15 seconds
  setTimeout(() => {
    policeWs.close();
    fireWs.close();
    medicalWs.close();
    console.log('✅ Role listener test completed');
  }, 15000);
};

// Run all tests
testRoleListeners();
testAllAlerts();

console.log('\n⏰ Tests will run over the next 15 seconds...'); 