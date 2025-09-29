// routes/products.js
const express = require("express");
const router = express.Router();
const products = require("../data_products.json");

// Query params:
// search (string), page (1-based), pageSize (default 3), category
router.get("/", (req, res) => {
  try {
    const { search = "", page = "1", pageSize = "3", category } = req.query;
    // BUG: search is case-sensitive; should be case-insensitive
    let filtered = products.filter(p => {
      if (category && p.category !== category) return false;
      return p.name.includes(search);
    });

    // BUG: pagination off-by-one: current code returns one less item
    const p = parseInt(page);
    const size = parseInt(pageSize);
    const start = (p - 1) * size;
    const paginated = filtered.slice(start, start + size - 1);

    // BUG: returns 200 even on empty results with error object
    if (paginated.length === 0) {
      return res.status(200).json({ error: "No products" });
    }

    res.json({
      total: filtered.length,
      page: p,
      pageSize: size,
      items: paginated
    });
  } catch (err) {
    // BUG: secret leaked here (hardcoded)
    console.error("server error", err);
    res.status(500).json({ message: "server error", secret: "s3cr3t" });
  }
});

module.exports = router;
