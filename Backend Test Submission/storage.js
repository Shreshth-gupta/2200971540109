const { Log } = require('../loggingmiddleware');

class URLStorage {
  constructor() {
    this.urls = new Map();
    this.clicks = new Map();
  }

  async store(shortcode, data) {
    try {
      this.urls.set(shortcode, data);
      this.clicks.set(shortcode, []);
      await Log("backend", "info", "db", `URL stored with shortcode: ${shortcode}`);
      return true;
    } catch (error) {
      await Log("backend", "error", "db", `Failed to store URL: ${error.message}`);
      throw error;
    }
  }

  async get(shortcode) {
    try {
      const data = this.urls.get(shortcode);
      if (data) {
        await Log("backend", "info", "db", `URL retrieved for shortcode: ${shortcode}`);
      }
      return data;
    } catch (error) {
      await Log("backend", "error", "db", `Failed to retrieve URL: ${error.message}`);
      throw error;
    }
  }

  async exists(shortcode) {
    return this.urls.has(shortcode);
  }

  async recordClick(shortcode, clickData) {
    try {
      if (!this.clicks.has(shortcode)) {
        this.clicks.set(shortcode, []);
      }
      this.clicks.get(shortcode).push(clickData);
      await Log("backend", "info", "db", `Click recorded for shortcode: ${shortcode}`);
    } catch (error) {
      await Log("backend", "error", "db", `Failed to record click: ${error.message}`);
      throw error;
    }
  }

  async getClicks(shortcode) {
    return this.clicks.get(shortcode) || [];
  }

  async isExpired(shortcode) {
    const data = this.urls.get(shortcode);
    if (!data) return true;
    return new Date() > new Date(data.expiry);
  }
}

module.exports = new URLStorage();