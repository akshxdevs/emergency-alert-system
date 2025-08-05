const WebSocket = require('ws');

// Test police emergency reporting
const testPoliceReport = () => {
  const ws = new WebSocket('ws://localhost:5000/test-user/?CIVILIAN');
  
  ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    // Test police emergency alert
    const policeAlert = {
      type: "NEW_ALERT",
      payload: {
        type: "CRIME", // This should now work correctly
        priority: "HIGH",
        status: "REPORT",
        description: "Test police emergency",
        assignedTo: "POLICE",
        location: {
          lat: 40.7128,
          long: -74.0060
        }
      }
    };
    
    console.log('Sending police alert:', policeAlert);
    ws.send(JSON.stringify(policeAlert));
    
    // Wait longer for processing
    setTimeout(() => {
      console.log('Test completed. Closing connection...');
      ws.close();
    }, 5000);
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);
      
      if (message.type === 'success') {
        console.log('✅ Police alert sent successfully!');
      } else if (message.type === 'error') {
        console.log('❌ Error:', message.message);
      } else if (message.type === 'welcome') {
        console.log('✅ Welcome message received');
      } else if (message.type === 'HIGH_PRIORITY_ALERT') {
        console.log('✅ High priority alert broadcast received');
      } else if (message.type === 'ALERT_UPDATED') {
        console.log('✅ Alert updated message received');
      } else {
        console.log('ℹ️ Other message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
};

// Run the test
console.log('Starting police emergency test...');
testPoliceReport(); 