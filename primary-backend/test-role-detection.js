const WebSocket = require('ws');

const testRoleDetection = () => {
  console.log('🚀 Testing Role Detection Functionality...\n');
  
  // Test different role scenarios
  const testScenarios = [
    { role: 'POLICE', description: 'Police Dashboard' },
    { role: 'FIRE', description: 'Fire Dashboard' },
    { role: 'MEDICAL', description: 'Medical Dashboard' },
    { role: 'police', description: 'Lowercase Police' },
    { role: 'firefighter', description: 'Firefighter Role' },
    { role: 'medic', description: 'Medic Role' },
    { role: 'INVALID', description: 'Invalid Role' }
  ];
  
  let currentTest = 0;
  
  const runTest = () => {
    if (currentTest >= testScenarios.length) {
      console.log('\n✅ All role detection tests completed!');
      return;
    }
    
    const scenario = testScenarios[currentTest];
    console.log(`\n🧪 Testing: ${scenario.description} (${scenario.role})`);
    
    const dashboardUserId = `dashboard-${scenario.role}-${Date.now()}`;
    const ws = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?${scenario.role}`);
    
    ws.on('open', () => {
      console.log(`✅ Connected as ${scenario.role}`);
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'welcome') {
          console.log('👋 Welcome message received');
          
          // Wait a bit then close and test next scenario
          setTimeout(() => {
            ws.close();
            currentTest++;
            setTimeout(runTest, 1000);
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });
    
    ws.on('error', (err) => {
      console.error(`❌ Error for ${scenario.role}:`, err.message);
      currentTest++;
      setTimeout(runTest, 1000);
    });
    
    ws.on('close', (event) => {
      console.log(`🔌 Connection closed for ${scenario.role}`);
    });
  };
  
  runTest();
};

console.log('🚀 Starting role detection test...');
testRoleDetection(); 