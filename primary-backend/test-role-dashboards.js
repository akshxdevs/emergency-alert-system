const WebSocket = require('ws');

const testRoleDashboards = () => {
  console.log('🚀 Testing Role-Specific Dashboards...\n');

  // Test 1: Police Dashboard
  console.log('👮 Testing Police Dashboard...');
  const policeWs = new WebSocket('ws://localhost:5000/police-officer/?POLICE');
  
  policeWs.on('open', () => {
    console.log('✅ Police WebSocket connected');
  });
  
  policeWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Police received:', message.type);
    
    if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
      console.log('🚔 Police received appropriate alert:', message.type);
    }
  });

  // Test 2: Fire Dashboard
  console.log('🚒 Testing Fire Dashboard...');
  const fireWs = new WebSocket('ws://localhost:5000/firefighter/?FIRE');
  
  fireWs.on('open', () => {
    console.log('✅ Fire WebSocket connected');
  });
  
  fireWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Fire received:', message.type);
    
    if (message.type === 'FIRE') {
      console.log('🚒 Fire received appropriate alert:', message.type);
    }
  });

  // Test 3: Medical Dashboard
  console.log('🚑 Testing Medical Dashboard...');
  const medicalWs = new WebSocket('ws://localhost:5000/medic/?MEDICAL');
  
  medicalWs.on('open', () => {
    console.log('✅ Medical WebSocket connected');
  });
  
  medicalWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Medical received:', message.type);
    
    if (message.type === 'MEDICAL') {
      console.log('🚑 Medical received appropriate alert:', message.type);
    }
  });

  // Test civilian reporting
  setTimeout(() => {
    console.log('\n👤 Testing civilian reporting...');
    const civilianWs = new WebSocket('ws://localhost:5000/civilian/?CIVILIAN');
    
    civilianWs.on('open', () => {
      console.log('✅ Civilian WebSocket connected');
      
      // Send crime alert (should go to police)
      setTimeout(() => {
        const crimeAlert = {
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
        civilianWs.send(JSON.stringify(crimeAlert));
        console.log('🚔 Sent crime alert (should go to police)');
      }, 1000);

      // Send fire alert (should go to fire)
      setTimeout(() => {
        const fireAlert = {
          type: "NEW_ALERT",
          payload: {
            type: "FIRE",
            priority: "HIGH",
            status: "REPORTED",
            description: "Test fire emergency",
            assignedTo: "FIRE",
            location: {
              lat: 40.7128,
              long: -74.0060
            }
          }
        };
        civilianWs.send(JSON.stringify(fireAlert));
        console.log('🚒 Sent fire alert (should go to fire)');
      }, 3000);

      // Send medical alert (should go to medical)
      setTimeout(() => {
        const medicalAlert = {
          type: "NEW_ALERT",
          payload: {
            type: "MEDICAL",
            priority: "HIGH",
            status: "REPORTED",
            description: "Test medical emergency",
            assignedTo: "MEDICAL",
            location: {
              lat: 40.7128,
              long: -74.0060
            }
          }
        };
        civilianWs.send(JSON.stringify(medicalAlert));
        console.log('🚑 Sent medical alert (should go to medical)');
      }, 5000);

      // Test alert status updates
      setTimeout(() => {
        const statusUpdate = {
          type: "UPDATE_ALERT_STATUS",
          payload: {
            alertId: "test-alert-id",
            newStatus: "IN_PROCESS"
          }
        };
        civilianWs.send(JSON.stringify(statusUpdate));
        console.log('📝 Sent status update test');
      }, 7000);
    });

    civilianWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Civilian received response:', message.type);
    });

    civilianWs.on('error', (error) => {
      console.error('❌ Civilian WebSocket error:', error);
    });

    civilianWs.on('close', () => {
      console.log('🔌 Civilian WebSocket closed');
    });
  }, 2000);

  // Cleanup after 15 seconds
  setTimeout(() => {
    console.log('\n🧹 Cleaning up connections...');
    policeWs.close();
    fireWs.close();
    medicalWs.close();
    console.log('✅ Role dashboard test completed');
  }, 15000);
};

console.log('🚀 Starting role dashboard test...');
testRoleDashboards(); 