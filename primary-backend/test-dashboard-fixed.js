const WebSocket = require('ws');

const testDashboardFixed = () => {
  console.log('🚀 Testing Dashboard Fixed URL...\n');

  // Connect as Police Dashboard with fixed URL format
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  console.log('👮 Connecting as Police Dashboard with URL:', `ws://localhost:5000/${dashboardUserId}/?POLICE`);
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected successfully');
  });
  
  policeWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Police Dashboard received:', message.type);
    
    if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
      console.log('🚔 Police Dashboard received appropriate alert:', message.type);
      console.log('📋 Alert payload:', message.payload);
    }
  });

  policeWs.on('error', (error) => {
    console.error('❌ Police Dashboard WebSocket error:', error);
  });

  policeWs.on('close', (event) => {
    console.log('🔌 Police Dashboard WebSocket closed:', event.code, event.reason);
  });

  // Connect as Civilian to send test alerts
  setTimeout(() => {
    console.log('\n👤 Connecting as Civilian to send test alerts...');
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
            description: "Test crime for fixed dashboard",
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
    });

    civilianWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Civilian received response:', message.type);
    });
  }, 2000);

  // Cleanup after 8 seconds
  setTimeout(() => {
    console.log('\n🧹 Cleaning up...');
    policeWs.close();
    console.log('✅ Dashboard fixed test completed');
  }, 8000);
};

console.log('🚀 Starting dashboard fixed test...');
testDashboardFixed(); 