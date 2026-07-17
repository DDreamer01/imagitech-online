/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".xml": "application/xml",
  ".json": "application/json",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
};

const server = http.createServer((req, res) => {
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request: Malformed URI");
    return;
  }
  let filePath = path.join(__dirname, "out", decodedUrl === "/" ? "index.html" : decodedUrl);

  // Clean URLs resolution (append .html if file doesn't exist directly)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(filePath + ".html")) {
      filePath += ".html";
    } else {
      // 404 Fallback
      filePath = path.join(__dirname, "out", "404.html");
      res.statusCode = 404;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(res.statusCode || 200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    });
    res.end(data);
  });
});

const PORT = 80;
// Bind to 0.0.0.0 to listen on all interfaces
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Production static server listening on http://0.0.0.0:${PORT}`);
});
