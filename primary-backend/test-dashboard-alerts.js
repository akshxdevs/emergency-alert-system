const WebSocket = require('ws');

const testDashboardAlerts = () => {
  console.log('🚀 Testing Dashboard Alert Reception...\n');

  // Connect as Police Dashboard
  console.log('👮 Connecting as Police Dashboard...');
  const policeWs = new WebSocket('ws://localhost:5000/police-dashboard/?POLICE');
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
  });
  
  policeWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Police Dashboard received:', message.type);
    
    if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
      console.log('🚔 Police Dashboard received appropriate alert:', message.type);
      console.log('📋 Alert payload:', message.payload);
    }
  });

  // Connect as Civilian to send alerts
  setTimeout(() => {
    console.log('\n👤 Connecting as Civilian to send alerts...');
    const civilianWs = new WebSocket('ws://localhost:5000/civilian/?CIVILIAN');
    
    civilianWs.on('open', () => {
      console.log('✅ Civilian connected');
      
      // Send a crime alert
      setTimeout(() => {
        const crimeAlert = {
          type: "NEW_ALERT",
          payload: {
            type: "CRIME",
            priority: "HIGH",
            status: "REPORTED",
            description: "Test crime for dashboard",
            assignedTo: "POLICE",
            location: {
              lat: 40.7128,
              long: -74.0060
            }
          }
        };
        civilianWs.send(JSON.stringify(crimeAlert));
        console.log('🚔 Sent crime alert to Police Dashboard');
      }, 1000);

      // Send a fire alert (should not go to police)
      setTimeout(() => {
        const fireAlert = {
          type: "NEW_ALERT",
          payload: {
            type: "FIRE",
            priority: "MEDIUM",
            status: "REPORTED",
            description: "Test fire alert",
            assignedTo: "FIRE",
            location: {
              lat: 40.7589,
              long: -73.9851
            }
          }
        };
        civilianWs.send(JSON.stringify(fireAlert));
        console.log('🔥 Sent fire alert (should not go to police)');
      }, 3000);
    });

    civilianWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Civilian received response:', message.type);
    });
  }, 2000);

  // Cleanup after 10 seconds
  setTimeout(() => {
    console.log('\n🧹 Cleaning up...');
    policeWs.close();
    console.log('✅ Dashboard alert test completed');
  }, 10000);
};

console.log('🚀 Starting dashboard alert test...');
testDashboardAlerts(); 