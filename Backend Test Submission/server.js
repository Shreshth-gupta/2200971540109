const express = require('express');
const { Log } = require('../loggingmiddleware');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  await Log("backend", "debug", "middleware", `${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/', routes);

app.use(async (err, req, res, next) => {
  await Log("backend", "error", "middleware", `Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

app.use(async (req, res) => {
  await Log("backend", "warn", "middleware", `404 - Route not found: ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, async () => {
  await Log("backend", "info", "service", `URL Shortener service started on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;