const WebSocket = require('ws');

const debugTest = () => {
  const ws = new WebSocket('ws://localhost:5000/debug-user/?CIVILIAN');
  
  ws.on('open', () => {
    console.log('✅ Connected to WebSocket server');
    
    // Send a simple test message
    const testMessage = {
      type: "NEW_ALERT",
      payload: {
        type: "CRIME",
        priority: "LOW",
        status: "REPORT",
        description: "Debug test",
        assignedTo: "POLICE",
        location: {
          lat: 40.7128,
          long: -74.0060
        }
      }
    };
    
    console.log('📤 Sending test message:', testMessage);
    ws.send(JSON.stringify(testMessage));
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📥 Received message:', message);
      
      if (message.type === 'success') {
        console.log('✅ SUCCESS: Alert sent successfully!');
      } else if (message.type === 'error') {
        console.log('❌ ERROR:', message.message);
      } else if (message.type === 'welcome') {
        console.log('👋 Welcome message received');
      } else {
        console.log('ℹ️ Other message:', message.type);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });
  
  // Close after 10 seconds
  setTimeout(() => {
    console.log('⏰ Test timeout, closing connection...');
    ws.close();
  }, 10000);
};

console.log('🚀 Starting debug test...');
debugTest(); 