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
    //case insensitive search
    let filtered = products.filter(p => {
      if (category && p.category !== category) return false;
      return p.name.toLowerCase().includes(search.toLowerCase());
    });

    // BUG: pagination off-by-one: current code returns one less item
    //Fix off-by-one error in pagination
    const p = parseInt(page);
    const size = parseInt(pageSize);
    const start = (p - 1) * size;
    const paginated = filtered.slice(start, start + size);

    // BUG: returns 200 even on empty results with error object
    //404 proper message for no products found
    if (paginated.length === 0) {
      return res.status(404).json({ error: "No products" });
    }

    res.json({
      total: filtered.length,
      page: p,
      pageSize: size,
      items: paginated
    });
  } catch (err) {
    // BUG: secret leaked here (hardcoded)
    //Fix secret leak
    console.error("server error", err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
