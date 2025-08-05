const WebSocket = require('ws');

const testPendingAlerts = () => {
  console.log('🚀 Testing Pending Alerts Functionality...\n');
  
  // Connect as Police Dashboard
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
  });
  
  policeWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Police Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
        console.log('🚨 Received pending alert:', message.payload);
        console.log('📊 Alert Status:', message.payload.status);
        console.log('📍 Location:', message.payload.location);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  policeWs.on('error', (err) => {
    console.error('❌ Police Dashboard WebSocket error:', err);
  });
  
  policeWs.on('close', (event) => {
    console.log('🔌 Police Dashboard WebSocket closed:', event.code, event.reason);
  });
  
  // Connect as Fire Dashboard
  const fireDashboardUserId = `dashboard-FIRE-${Date.now()}`;
  const fireWs = new WebSocket(`ws://localhost:5000/${fireDashboardUserId}/?FIRE`);
  
  fireWs.on('open', () => {
    console.log('✅ Fire Dashboard connected');
  });
  
  fireWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Fire Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'FIRE') {
        console.log('🔥 Received pending fire alert:', message.payload);
        console.log('📊 Alert Status:', message.payload.status);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  fireWs.on('error', (err) => {
    console.error('❌ Fire Dashboard WebSocket error:', err);
  });
  
  fireWs.on('close', (event) => {
    console.log('🔌 Fire Dashboard WebSocket closed:', event.code, event.reason);
  });
  
  // Keep connections alive for 10 seconds to see pending alerts
  setTimeout(() => {
    console.log('\n⏰ Test completed, closing connections...');
    policeWs.close();
    fireWs.close();
  }, 10000);
};

console.log('🚀 Starting pending alerts test...');
testPendingAlerts(); 