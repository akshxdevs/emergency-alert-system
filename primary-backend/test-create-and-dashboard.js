const WebSocket = require('ws');

const testCreateAndDashboard = () => {
  console.log('🚀 Testing Create Alerts and Dashboard Functionality...\n');
  
  // First, create some test alerts
  const createTestAlerts = () => {
    return new Promise((resolve) => {
      console.log('📝 Creating test alerts...');
      
      const civilianWs = new WebSocket('ws://localhost:5000/test-civilian/?CIVILIAN');
      
      civilianWs.on('open', () => {
        console.log('✅ Civilian connected for creating alerts');
        
        // Create a CRIME alert
        setTimeout(() => {
          console.log('🚔 Creating CRIME alert...');
          civilianWs.send(JSON.stringify({
            type: 'NEW_ALERT',
            payload: {
              type: 'CRIME',
              status: 'REPORTED',
              assignedTo: 'POLICE',
              description: 'Test crime alert for dashboard',
              priority: 'HIGH',
              location: { lat: 40.7128, long: -74.0060 }
            }
          }));
        }, 1000);
        
        // Create an ACCIDENT alert
        setTimeout(() => {
          console.log('🚗 Creating ACCIDENT alert...');
          civilianWs.send(JSON.stringify({
            type: 'NEW_ALERT',
            payload: {
              type: 'ACCIDENT',
              status: 'REPORTED',
              assignedTo: 'POLICE',
              description: 'Test accident alert for dashboard',
              priority: 'MEDIUM',
              location: { lat: 40.7589, long: -73.9851 }
            }
          }));
        }, 2000);
        
        // Create a FIRE alert
        setTimeout(() => {
          console.log('🔥 Creating FIRE alert...');
          civilianWs.send(JSON.stringify({
            type: 'NEW_ALERT',
            payload: {
              type: 'FIRE',
              status: 'REPORTED',
              assignedTo: 'FIRE',
              description: 'Test fire alert for dashboard',
              priority: 'HIGH',
              location: { lat: 40.7505, long: -73.9934 }
            }
          }));
        }, 3000);
        
        // Close civilian connection after creating alerts
        setTimeout(() => {
          console.log('🔌 Closing civilian connection...');
          civilianWs.close();
          resolve();
        }, 4000);
      });
      
      civilianWs.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'success') {
            console.log('✅ Alert created successfully');
          } else if (message.type === 'error') {
            console.log('❌ Error creating alert:', message.message);
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      });
    });
  };
  
  // Then test dashboard functionality
  const testDashboard = () => {
    console.log('\n📊 Testing Dashboard with Pending Alerts...');
    
    // Connect as Police Dashboard
    const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
    const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
    
    let receivedAlerts = [];
    
    policeWs.on('open', () => {
      console.log('✅ Police Dashboard connected');
      console.log('📋 Waiting for pending alerts...');
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
          
          // Test cancel functionality for the first alert
          if (receivedAlerts.length === 1) {
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
    
    // Keep connection alive for 20 seconds
    setTimeout(() => {
      console.log('\n📊 Summary:');
      console.log(`📋 Total pending alerts received: ${receivedAlerts.length}`);
      receivedAlerts.forEach((alert, index) => {
        console.log(`${index + 1}. ${alert.type} - ${alert.status} - Priority: ${alert.priority}`);
      });
      console.log('\n⏰ Test completed, closing connection...');
      policeWs.close();
    }, 20000);
  };
  
  // Run the test sequence
  createTestAlerts().then(() => {
    // Wait a bit for alerts to be processed, then test dashboard
    setTimeout(testDashboard, 3000);
  });
};

console.log('🚀 Starting create and dashboard test...');
testCreateAndDashboard(); 