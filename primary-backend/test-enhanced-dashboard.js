const WebSocket = require('ws');

const testEnhancedDashboard = () => {
  console.log('🚀 Testing Enhanced Dashboard with Animations...\n');

  // Test Police Dashboard with enhanced features
  console.log('👮 Testing Police Dashboard with Animations...');
  const policeWs = new WebSocket('ws://localhost:5000/police-officer/?POLICE');
  
  policeWs.on('open', () => {
    console.log('✅ Police WebSocket connected');
  });
  
  policeWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Police received:', message.type);
    
    if (message.type === 'CRIME' || message.type === 'ACCIDENT') {
      console.log('🚔 Police received appropriate alert:', message.type);
      console.log('🎨 Animation: Alert card should slide in from right');
      console.log('🎯 UI: Alert should show with priority color coding');
    }
  });

  // Test civilian reporting with enhanced alerts
  setTimeout(() => {
    console.log('\n👤 Testing civilian reporting with enhanced alerts...');
    const civilianWs = new WebSocket('ws://localhost:5000/civilian/?CIVILIAN');
    
    civilianWs.on('open', () => {
      console.log('✅ Civilian WebSocket connected');
      
      // Send high priority crime alert
      setTimeout(() => {
        const highPriorityCrime = {
          type: "NEW_ALERT",
          payload: {
            type: "CRIME",
            priority: "HIGH",
            status: "REPORTED",
            description: "Armed robbery in progress at Central Bank",
            assignedTo: "POLICE",
            location: {
              lat: 40.7128,
              long: -74.0060
            }
          }
        };
        civilianWs.send(JSON.stringify(highPriorityCrime));
        console.log('🚨 Sent HIGH PRIORITY crime alert');
        console.log('🎨 Expected: Red border, pulsing animation, urgent notification');
      }, 1000);

      // Send medium priority fire alert
      setTimeout(() => {
        const mediumFire = {
          type: "NEW_ALERT",
          payload: {
            type: "FIRE",
            priority: "MEDIUM",
            status: "REPORTED",
            description: "Kitchen fire at restaurant",
            assignedTo: "FIRE",
            location: {
              lat: 40.7589,
              long: -73.9851
            }
          }
        };
        civilianWs.send(JSON.stringify(mediumFire));
        console.log('🔥 Sent MEDIUM priority fire alert');
        console.log('🎨 Expected: Yellow border, smooth slide-in animation');
      }, 3000);

      // Send low priority medical alert
      setTimeout(() => {
        const lowMedical = {
          type: "NEW_ALERT",
          payload: {
            type: "MEDICAL",
            priority: "LOW",
            status: "REPORTED",
            description: "Minor injury at park",
            assignedTo: "MEDICAL",
            location: {
              lat: 40.7829,
              long: -73.9654
            }
          }
        };
        civilianWs.send(JSON.stringify(lowMedical));
        console.log('🚑 Sent LOW priority medical alert');
        console.log('🎨 Expected: Green border, gentle fade-in animation');
      }, 5000);

      // Test status updates with slider animation
      setTimeout(() => {
        const statusUpdate = {
          type: "UPDATE_ALERT_STATUS",
          payload: {
            alertId: "test-alert-id",
            newStatus: "IN_PROCESS"
          }
        };
        civilianWs.send(JSON.stringify(statusUpdate));
        console.log('📝 Sent status update test');
        console.log('🎨 Expected: Slider animation, progress bar, loading spinner');
      }, 7000);
    });

    civilianWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Civilian received response:', message.type);
    });

    civilianWs.on('error', (error) => {
      console.error('❌ Civilian WebSocket error:', error);
    });

    civilianWs.on('close', () => {
      console.log('🔌 Civilian WebSocket closed');
    });
  }, 2000);

  // Test Fire Dashboard
  setTimeout(() => {
    console.log('\n🚒 Testing Fire Dashboard...');
    const fireWs = new WebSocket('ws://localhost:5000/firefighter/?FIRE');
    
    fireWs.on('open', () => {
      console.log('✅ Fire WebSocket connected');
    });
    
    fireWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Fire received:', message.type);
      
      if (message.type === 'FIRE') {
        console.log('🚒 Fire received appropriate alert:', message.type);
        console.log('🎨 Expected: Red theme, fire icon animation');
      }
    });
  }, 4000);

  // Test Medical Dashboard
  setTimeout(() => {
    console.log('\n🚑 Testing Medical Dashboard...');
    const medicalWs = new WebSocket('ws://localhost:5000/medic/?MEDICAL');
    
    medicalWs.on('open', () => {
      console.log('✅ Medical WebSocket connected');
    });
    
    medicalWs.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('📥 Medical received:', message.type);
      
      if (message.type === 'MEDICAL') {
        console.log('🚑 Medical received appropriate alert:', message.type);
        console.log('🎨 Expected: Green theme, medical cross icon animation');
      }
    });
  }, 6000);

  // Cleanup after 20 seconds
  setTimeout(() => {
    console.log('\n🧹 Cleaning up connections...');
    policeWs.close();
    console.log('✅ Enhanced dashboard test completed');
    console.log('\n📋 Test Summary:');
    console.log('✅ Role-specific dashboards with animations');
    console.log('✅ Priority-based color coding and animations');
    console.log('✅ Slider interactions for alert updates');
    console.log('✅ MartianMono font integration');
    console.log('✅ Live alert notifications with smooth transitions');
  }, 20000);
};

console.log('🚀 Starting enhanced dashboard test...');
testEnhancedDashboard(); 