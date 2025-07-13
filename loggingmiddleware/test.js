const { Log } = require('./index.js');

async function testLogging() {
  try {
    const result = await Log("backend", "error", "handler", "received string, expected bool");
    console.log('Log created:', result);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLogging();