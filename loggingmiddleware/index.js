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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaHJlc2h0aGEuMjJnY2ViZHMwOTRAZ2FsZ290aWFjb2xsZWdlLmVkdSIsImV4cCI6MTc1MTAxNTcyNywiaWF0IjoxNzUxMDE0ODI3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiM2QyNjY5NGMtYzNiNy00NTljLWJhNzAtYTY5MmIxZTAwODY2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hyZXNodGhhIGd1cHRhIiwic3ViIjoiMzQxOGNmMTYtYTc2MS00ZDc0LTk2NDYtN2RhM2M4YmM4YTc5In0sImVtYWlsIjoic2hyZXNodGhhLjIyZ2NlYmRzMDk0QGdhbGdvdGlhY29sbGVnZS5lZHUiLCJuYW1lIjoic2hyZXNodGhhIGd1cHRhIiwicm9sbE5vIjoiMjIwMDk3MTU0MDEwOSIsImFjY2Vzc0NvZGUiOiJNdWFndnEiLCJjbGllbnRJRCI6IjM0MThjZjE2LWE3NjEtNGQ3NC05NjQ2LTdkYTNjOGJjOGE3OSIsImNsaWVudFNlY3JldCI6IlhEZlN4UFNBVlpZeUdyaHcifQ.OG01R9yhDWmZyi1KJPyxVEZwL4kmnqzBuaZIN5YsraY'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Logging failed:', error.message);
    throw error;
  }
}

module.exports = { Log };