const WebSocket = require('ws');

const testLocationFeatures = () => {
  console.log('🚀 Testing Location Features...\n');
  
  // Connect as Police Dashboard
  const dashboardUserId = `dashboard-POLICE-${Date.now()}`;
  const policeWs = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?POLICE`);
  
  let receivedAlerts = [];
  
  policeWs.on('open', () => {
    console.log('✅ Police Dashboard connected');
    console.log('📋 Waiting for alerts to test location features...');
  });
  
  policeWs.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Police Dashboard received:', message.type);
      
      if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
        console.log('🚨 Received alert:', message.payload.id);
        console.log('📍 Location:', message.payload.location[0]);
        console.log('📊 Coordinates:', {
          lat: message.payload.location[0]?.lat,
          lng: message.payload.location[0]?.long
        });
        
        receivedAlerts.push(message.payload);
        
        // Test location features
        if (receivedAlerts.length === 1) {
          const alert = receivedAlerts[0];
          const location = alert.location[0];
          
          console.log('\n🗺️ Location Features Test:');
          console.log('📍 Show Location Button: Should center map on alert location');
          console.log('🗺️ Get Directions Button: Should open Google Maps with directions');
          console.log('📊 Test Coordinates:', location);
          
          // Simulate clicking "Show on Map"
          setTimeout(() => {
            console.log('\n📍 Simulating "Show on Map" click...');
            console.log('Expected: Map centers on alert location with marker');
          }, 2000);
          
          // Simulate clicking "Get Directions"
          setTimeout(() => {
            console.log('\n🗺️ Simulating "Get Directions" click...');
            console.log('Expected: Opens Google Maps with directions to alert location');
            console.log('Google Maps URL:', `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.long}`);
          }, 4000);
        }
      } else if (message.type === 'success') {
        console.log('✅ Success message:', message.message);
      } else if (message.type === 'error') {
        console.log('❌ Error message:', message.message);
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
  
  // Keep connection alive for 10 seconds
  setTimeout(() => {
    console.log('\n📊 Summary:');
    console.log(`📋 Total alerts received: ${receivedAlerts.length}`);
    if (receivedAlerts.length > 0) {
      const alert = receivedAlerts[0];
      console.log('📍 Alert Location:', alert.location[0]);
      console.log('🗺️ Google Maps URL:', `https://www.google.com/maps/dir/?api=1&destination=${alert.location[0].lat},${alert.location[0].long}`);
    }
    console.log('\n⏰ Test completed, closing connection...');
    policeWs.close();
  }, 10000);
};

console.log('🚀 Starting location features test...');
testLocationFeatures(); 