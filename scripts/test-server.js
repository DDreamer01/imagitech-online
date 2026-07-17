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

const OUT_DIR = path.resolve(__dirname, "..", "out");

const server = http.createServer((req, res) => {
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request: Malformed URI");
    return;
  }

  // Normalize path
  let safePath = path.normalize(decodedUrl).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(OUT_DIR, safePath === "/" ? "index.html" : safePath);

  // Clean URLs resolution (append .html if file doesn't exist directly or is a directory)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(filePath + ".html") && !fs.statSync(filePath + ".html").isDirectory()) {
      filePath += ".html";
    } else {
      // 404 Fallback
      filePath = path.join(OUT_DIR, "404.html");
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
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Test static server listening on http://0.0.0.0:${PORT}`);
});
