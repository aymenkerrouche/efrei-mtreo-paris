"use strict";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = require("pg");
const db = new Pool({
  host: process.env.PGHOST || "postgres",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "app",
  password: process.env.PGPASSWORD || "app",
  database: process.env.PGDATABASE || "dernier_metro",
});

// Logger minimal: méthode, chemin, status, durée
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on("finish", () => {
    const dt = Date.now() - t0;
    console.log(`${req.method} ${req.path} -> ${res.statusCode} ${dt}ms`);
  });
  next();
});

// Santé
app.get("/health", (_req, res) =>
  res.status(200).json({ status: "ok", service: "dernier-metro-api" })
);

// Utilitaire pour simuler un horaire HH:MM
function nextTimeFromNow(headwayMin = 3) {
  const now = new Date();
  const next = new Date(now.getTime() + headwayMin * 60 * 1000);
  const hh = String(next.getHours()).padStart(2, "0");
  const mm = String(next.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Endpoint métier minimal
app.get("/next-metro", (req, res) => {
  const station = (req.query.station || "").toString().trim();
  if (!station) return res.status(400).json({ error: "missing station" });
  return res.status(200).json({
    station,
    line: "M1",
    headwayMin: 3,
    nextArrival: nextTimeFromNow(3),
  });
});

// /last-metro: lit la DB via la table config
app.get("/last-metro", async (req, res) => {
  const station = (req.query.station || "").toString().trim();
  if (!station) return res.status(400).json({ error: "missing station" });
  try {
    // Get defaults
    const defaultsResult = await db.query(
      "SELECT value FROM config WHERE key = 'metro.defaults'"
    );
    if (!defaultsResult.rows.length)
      return res.status(500).json({ error: "Missing defaults config" });
    let defaults;
    try {
      defaults = defaultsResult.rows[0].value;
      if (typeof defaults === "string") defaults = JSON.parse(defaults);
    } catch (e) {
      return res.status(500).json({ error: "Invalid defaults config" });
    }

    // Get last metro for station (case-insensitive)
    const lastResult = await db.query(
      "SELECT value FROM config WHERE key = 'metro.last'"
    );
    if (!lastResult.rows.length)
      return res.status(500).json({ error: "Missing last metro config" });
    let lastMap;
    try {
      lastMap = lastResult.rows[0].value;
      if (typeof lastMap === "string") lastMap = JSON.parse(lastMap);
    } catch (e) {
      return res.status(500).json({ error: "Invalid last metro config" });
    }
    // Find station (case-insensitive)
    const foundKey = Object.keys(lastMap).find(
      (k) => k.toLowerCase() === station.toLowerCase()
    );
    if (!foundKey) return res.status(404).json({ error: "unknown station" });
    const lastMetro = lastMap[foundKey];
    return res.status(200).json({
      station: foundKey,
      lastMetro,
      line: defaults.line,
      tz: defaults.tz,
    });
  } catch (err) {
    return res.status(500).json({ error: "DB error", details: err.message });
  }
});

// 404 JSON
app.use((_req, res) => res.status(404).json({ error: "not found" }));

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
