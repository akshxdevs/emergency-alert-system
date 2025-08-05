const WebSocket = require('ws');

const testComprehensiveDashboard = () => {
  console.log('🚀 Testing Comprehensive Dashboard Functionality...\n');
  
  // Connect as Police Dashboard
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  let receivedAlerts = [];
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
    console.log('📋 Waiting for pending alerts from database...');
  });
  
  policeWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Police Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
        console.log('🚨 Received pending alert:', message.payload.id);
        console.log('📊 Alert Status:', message.payload.status);
        console.log('📍 Location:', message.payload.location);
        console.log('🎯 Priority:', message.payload.priority);
        
        receivedAlerts.push(message.payload);
        
        // If we have alerts, test the cancel functionality
        if (receivedAlerts.length > 0) {
          setTimeout(() => {
            const alertToCancel = receivedAlerts[0];
            console.log(`🗑️ Testing cancel for alert: ${alertToCancel.id}`);
            
            policeWs.send(JSON.stringify({
              type: 'CANCEL_ALERT',
              payload: { alertId: alertToCancel.id }
            }));
          }, 2000);
        }
      } else if (message.type === 'success') {
        console.log('✅ Success message:', message.message);
      } else if (message.type === 'error') {
        console.log('❌ Error message:', message.message);
      } else if (message.type === 'ALERT_CANCELLED') {
        console.log('🗑️ Alert cancelled successfully:', message.payload.id);
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
  
  // Keep connection alive for 15 seconds to see all pending alerts
  setTimeout(() => {
    console.log('\n📊 Summary:');
    console.log(`📋 Total pending alerts received: ${receivedAlerts.length}`);
    receivedAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.type} - ${alert.status} - Priority: ${alert.priority}`);
    });
    console.log('\n⏰ Test completed, closing connection...');
    policeWs.close();
  }, 15000);
};

console.log('🚀 Starting comprehensive dashboard test...');
testComprehensiveDashboard(); 