const crypto = require('crypto');
const { URL } = require('url');
const { Log } = require('../loggingmiddleware');

function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidShortcode(shortcode) {
  return /^[a-zA-Z0-9]{1,10}$/.test(shortcode);
}

function getExpiryDate(validityMinutes = 30) {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + validityMinutes);
  return expiry.toISOString();
}

async function getLocationFromIP(ip) {
  try {
    await Log("backend", "debug", "utils", `Getting location for IP: ${ip}`);
    return "Unknown Location";
  } catch (error) {
    await Log("backend", "error", "utils", `Failed to get location: ${error.message}`);
    return "Unknown Location";
  }
}

module.exports = {
  generateShortcode,
  isValidURL,
  isValidShortcode,
  getExpiryDate,
  getLocationFromIP
};