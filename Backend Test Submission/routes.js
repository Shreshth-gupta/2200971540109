const express = require('express');
const { Log } = require('../loggingmiddleware');
const storage = require('./storage');
const { generateShortcode, isValidURL, isValidShortcode, getExpiryDate, getLocationFromIP } = require('./utils');

const router = express.Router();

router.post('/shorturls', async (req, res) => {
  try {
    await Log("backend", "info", "route", "POST /shorturls request received");
    
    const { url, validity, shortcode } = req.body;

    if (!url || !isValidURL(url)) {
      await Log("backend", "warn", "route", "Invalid URL provided");
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let finalShortcode = shortcode;
    
    if (shortcode) {
      if (!isValidShortcode(shortcode)) {
        await Log("backend", "warn", "route", "Invalid shortcode format");
        return res.status(400).json({ error: "Invalid shortcode format" });
      }
      
      if (await storage.exists(shortcode)) {
        await Log("backend", "warn", "route", "Shortcode already exists");
        return res.status(409).json({ error: "Shortcode already exists" });
      }
    } else {
      do {
        finalShortcode = generateShortcode();
      } while (await storage.exists(finalShortcode));
    }

    const validityMinutes = validity || 30;
    const expiry = getExpiryDate(validityMinutes);
    
    const urlData = {
      originalUrl: url,
      shortcode: finalShortcode,
      expiry,
      createdAt: new Date().toISOString()
    };

    await storage.store(finalShortcode, urlData);
    
    const shortLink = `http://${req.get('host')}/${finalShortcode}`;
    
    await Log("backend", "info", "route", `Short URL created: ${finalShortcode}`);
    
    res.status(201).json({
      shortLink,
      expiry
    });

  } catch (error) {
    await Log("backend", "error", "route", `Error creating short URL: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    await Log("backend", "info", "route", `GET /shorturls/${shortcode} request received`);

    const urlData = await storage.get(shortcode);
    
    if (!urlData) {
      await Log("backend", "warn", "route", "Shortcode not found");
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (await storage.isExpired(shortcode)) {
      await Log("backend", "warn", "route", "Short URL expired");
      return res.status(410).json({ error: "Short URL has expired" });
    }

    const clicks = await storage.getClicks(shortcode);
    
    const stats = {
      shortcode,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiry: urlData.expiry,
      totalClicks: clicks.length,
      clicks: clicks.map(click => ({
        timestamp: click.timestamp,
        referrer: click.referrer || "Direct",
        location: click.location
      }))
    };

    await Log("backend", "info", "route", `Statistics retrieved for: ${shortcode}`);
    res.json(stats);

  } catch (error) {
    await Log("backend", "error", "route", `Error retrieving statistics: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    await Log("backend", "info", "route", `Redirect request for: ${shortcode}`);

    const urlData = await storage.get(shortcode);
    
    if (!urlData) {
      await Log("backend", "warn", "route", "Shortcode not found for redirect");
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (await storage.isExpired(shortcode)) {
      await Log("backend", "warn", "route", "Expired URL access attempt");
      return res.status(410).json({ error: "Short URL has expired" });
    }

    const clickData = {
      timestamp: new Date().toISOString(),
      referrer: req.get('Referer'),
      location: await getLocationFromIP(req.ip)
    };

    await storage.recordClick(shortcode, clickData);
    await Log("backend", "info", "route", `Redirecting to: ${urlData.originalUrl}`);
    
    res.redirect(urlData.originalUrl);

  } catch (error) {
    await Log("backend", "error", "route", `Error during redirect: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;