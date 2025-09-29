// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const products = require("./routes/products");

app.use(express.json());
app.use(cors());
// BUG: CORS is not enabled; frontend served on different port will fail
app.use("/api/products", products);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
