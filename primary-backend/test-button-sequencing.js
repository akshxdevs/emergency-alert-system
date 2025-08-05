const WebSocket = require('ws');

const testButtonSequencing = () => {
  console.log('🚀 Testing Button Sequencing and Status Updates...\n');
  
  // Connect as Police Dashboard
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  let receivedAlerts = [];
  let testStep = 0;
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
    console.log('📋 Waiting for alerts to test button sequencing...');
  });
  
  policeWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Police Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
        console.log('🚨 Received alert:', message.payload.id);
        console.log('📊 Initial Status:', message.payload.status);
        console.log('🔘 Expected Buttons: Start Response + Cancel');
        
        receivedAlerts.push(message.payload);
        
        // Test Step 1: Start Response (REPORTED → IN_PROCESS)
        if (receivedAlerts.length === 1) {
          setTimeout(() => {
            testStep++;
            console.log(`\n🔄 Step ${testStep}: Clicking "Start Response"`);
            console.log('📊 Expected Status Change: REPORTED → IN_PROCESS');
            console.log('🔘 Expected Buttons: Resolve (only)');
            
            policeWs.send(JSON.stringify({
              type: 'UPDATE_ALERT_STATUS',
              payload: { 
                alertId: message.payload.id, 
                newStatus: 'IN_PROCESS' 
              }
            }));
          }, 2000);
        }
      } else if (message.type === 'success') {
        console.log('✅ Success message:', message.message);
        
        if (testStep === 1) {
          setTimeout(() => {
            testStep++;
            console.log(`\n🔄 Step ${testStep}: Clicking "Resolve"`);
            console.log('📊 Expected Status Change: IN_PROCESS → RESOLVED');
            console.log('🔘 Expected Result: Alert disappears');
            
            policeWs.send(JSON.stringify({
              type: 'UPDATE_ALERT_STATUS',
              payload: { 
                alertId: receivedAlerts[0].id, 
                newStatus: 'RESOLVED' 
              }
            }));
          }, 2000);
        }
      } else if (message.type === 'error') {
        console.log('❌ Error message:', message.message);
      } else if (message.type === 'ALERT_UPDATED') {
        console.log('🔄 Alert updated:', message.payload.id, 'Status:', message.payload.status);
        
        if (message.payload.status === 'IN_PROCESS') {
          console.log('✅ Status correctly changed to IN_PROCESS');
          console.log('🔘 Start Response and Cancel buttons should be hidden');
          console.log('🔘 Only Resolve button should be visible');
        } else if (message.payload.status === 'RESOLVED') {
          console.log('✅ Status correctly changed to RESOLVED');
          console.log('🔘 Alert should disappear from the list');
        }
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
  
  // Keep connection alive for 15 seconds
  setTimeout(() => {
    console.log('\n📊 Summary:');
    console.log(`📋 Total alerts received: ${receivedAlerts.length}`);
    console.log('✅ Button sequencing test completed');
    console.log('\n⏰ Test completed, closing connection...');
    policeWs.close();
  }, 15000);
};

console.log('🚀 Starting button sequencing test...');
testButtonSequencing(); 