const WebSocket = require('ws');

const testPersistentAlerts = () => {
  console.log('🚀 Testing Persistent Alerts Functionality...\n');
  
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
        console.log('🚨 Received alert:', message.payload.id);
        console.log('📊 Alert Status:', message.payload.status);
        console.log('⏰ Auto-disappear at:', message.payload.autoDisappearAt ? new Date(message.payload.autoDisappearAt).toLocaleTimeString() : 'Never');
        console.log('🔄 Persistent:', message.payload.status === 'IN_PROCESS' ? 'Yes' : 'No');
        
        receivedAlerts.push(message.payload);
        
        // Test status update to make alert persistent
        if (receivedAlerts.length === 1 && message.payload.status === 'REPORTED') {
          setTimeout(() => {
            console.log(`🔄 Testing status update to IN_PROCESS for alert: ${message.payload.id}`);
            
            policeWs.send(JSON.stringify({
              type: 'UPDATE_ALERT_STATUS',
              payload: { 
                alertId: message.payload.id, 
                newStatus: 'IN_PROCESS' 
              }
            }));
          }, 3000);
        }
      } else if (message.type === 'success') {
        console.log('✅ Success message:', message.message);
      } else if (message.type === 'error') {
        console.log('❌ Error message:', message.message);
      } else if (message.type === 'ALERT_UPDATED') {
        console.log('🔄 Alert updated:', message.payload.id, 'Status:', message.payload.status);
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
  
  // Keep connection alive for 30 seconds to observe auto-disappear
  setTimeout(() => {
    console.log('\n📊 Summary:');
    console.log(`📋 Total alerts received: ${receivedAlerts.length}`);
    receivedAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.type} - ${alert.status} - Auto-disappear: ${alert.autoDisappearAt ? 'Yes' : 'No'}`);
    });
    console.log('\n⏰ Test completed, closing connection...');
    policeWs.close();
  }, 30000);
};

console.log('🚀 Starting persistent alerts test...');
testPersistentAlerts(); 