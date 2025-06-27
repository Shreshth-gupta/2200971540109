require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Validation constants
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', // backend only
  'api', 'component', 'hook', 'page', 'state', 'style', // frontend only
  'auth', 'config', 'middleware', 'utils' // both
];

async function Log(stack, level, packageName, message) {
  // Basic validation
  if (!VALID_STACKS.includes(stack) || !VALID_LEVELS.includes(level) || !VALID_PACKAGES.includes(packageName)) {
    throw new Error('Invalid log parameters');
  }

  const payload = {
    stack,
    level,
    package: packageName,
    message: message.length > 48 ? message.substring(0, 48) : message
  };

  try {
    const response = await axios.post(LOG_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.LOG_AUTH_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Logging failed:', error.message);
    throw error;
  }
}

module.exports = { Log };