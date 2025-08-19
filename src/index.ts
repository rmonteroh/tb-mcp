import express from "express";
import config from "./config/index.js";

const port = config.mcp.port;

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    name: "ticketbeep-mcp-http",
    version: "1.0.0",
    status: "running",
  });
});
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
