const WebSocket = require('ws');

const testCancelAlert = () => {
  console.log('🚀 Testing Cancel Alert Functionality...\n');
  
  // Connect as Police Dashboard
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
    
    // Wait a bit then send a cancel request
    setTimeout(() => {
      const testAlertId = 'test-alert-id-123';
      console.log(`🗑️ Sending cancel request for alert: ${testAlertId}`);
      
      policeWs.send(JSON.stringify({
        type: 'CANCEL_ALERT',
        payload: { alertId: testAlertId }
      }));
    }, 2000);
  });
  
  policeWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Police Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'success') {
        console.log('✅ Success message:', message.message);
      } else if (message.type === 'error') {
        console.log('❌ Error message:', message.message);
      } else if (message.type === 'ALERT_CANCELLED') {
        console.log('🗑️ Alert cancelled:', message.payload);
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
  
  // Keep connection alive for 8 seconds
  setTimeout(() => {
    console.log('\n⏰ Test completed, closing connection...');
    policeWs.close();
  }, 8000);
};

console.log('🚀 Starting cancel alert test...');
testCancelAlert(); 