const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const sharp = require('sharp');

const DATA_ROOT = path.join(__dirname, 'data');


/**
 * Set CORS headers to allow cross-origin requests
 * @param {http.ServerResponse} res
 */
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Sanitize a file/directory path to prevent escaping DATA_ROOT
 * @param {string} p
 * @returns {string} safe absolute path
 * @throws {Error} if path is outside of DATA_ROOT
 */
function safePath(p) {
  const resolved = path.normalize(path.join(DATA_ROOT, p));
  if (!resolved.startsWith(DATA_ROOT)) throw new Error('Invalid path');
  return resolved;
}

/**
 * HTTP server handling file endpoints
 */
const server = http.createServer((req, res) => {

    const urlParts = new URL(req.url, `http://${req.headers.host}`);

  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    setCORS(res);
    res.writeHead(200);
    return res.end();
  }

  // -------------------------
  // Load a file (/load)
  // -------------------------
  if (req.method === 'POST' && req.url === '/load') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { filename } = JSON.parse(body);
        if (!filename || typeof filename !== 'string') throw new Error('Missing filename');
        const filePath = safePath(filename);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `File not found: ${filename}` }));
          }
          try {
            const json = JSON.parse(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(json));
          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // -------------------------
  // Save a file (/save)
  // -------------------------
  if (req.method === 'POST' && req.url.startsWith('/save')) {
    setCORS(res);

    const filename = urlParts.searchParams.get('filename');

    if (!filename || typeof filename !== 'string') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing filename' }));
    }

    const filePath = safePath(filename);
    let body = '';

    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        let contentToWrite = body;

        // Normalize based on content-type
        const ct = req.headers['content-type'] || '';
        if (ct.includes('application/json')) {
          try {
            const parsed = JSON.parse(body);
            contentToWrite = JSON.stringify(parsed, null, 2); // pretty-print
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        }

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFile(filePath, contentToWrite, 'utf8', err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Write failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ saved: filename }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });

    return;
  }

  // -------------------------
  // List directory contents (/list)
  // -------------------------
  if (req.method === 'POST' && req.url === '/list') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        const dirPath = safePath(dirname || '.');
        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Directory not found' }));
          }
          const list = files.map(f => ({ name: f.name, type: f.isDirectory() ? 'dir' : 'file' }));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ dirname, list }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // -------------------------
  // Delete file or directory (/delete)
  // -------------------------
  if (req.method === 'POST' && req.url === '/delete') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { filename } = JSON.parse(body);
        if (!filename || typeof filename !== 'string') throw new Error('Missing filename');
        const filePath = safePath(filename);
        fs.rm(filePath, { recursive: true, force: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Delete failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ deleted: filename }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // -------------------------
  // Create directory (/mkdir)
  // -------------------------
  if (req.method === 'POST' && req.url === '/mkdir') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        if (!dirname || typeof dirname !== 'string') throw new Error('Missing dirname');
        const dirPath = safePath(dirname);
        fs.mkdir(dirPath, { recursive: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Mkdir failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ created: dirname }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // -------------------------
  // Remove directory (/rmdir)
  // -------------------------
  if (req.method === 'POST' && req.url === '/rmdir') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        if (!dirname || typeof dirname !== 'string') throw new Error('Missing dirname');
        const dirPath = safePath(dirname);
        // Use fs.rm instead of deprecated fs.rmdir
        fs.rm(dirPath, { recursive: true, force: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Rmdir failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ removed: dirname }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --------------------------
  // Add image streaming route
  // --------------------------

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  // const width = parseInt(req.query.width, 10);



if (pathname === '/image') {
    const relPath = urlObj.searchParams.get('file');

    if (!relPath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Missing file parameter');
    }

   // Build absolute path safely inside data/
    const absPath = path.normalize(path.join(DATA_ROOT, relPath));
    if (!absPath.startsWith(DATA_ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Access denied');
    }


    if (!absPath || !fs.existsSync(absPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(pathname + 'File not found!');
    }

    // Mime type lookup
    const ext = path.extname(absPath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
//  fs.createReadStream(absPath).pipe(res);
    let imgStream = fs.createReadStream(absPath);

    const width = parseInt(urlParts.searchParams.get('width')) || '';

    // Resize if width provided
    if (width && !isNaN(width)) {
      const transformer = sharp().resize(width);
      imgStream = imgStream.pipe(transformer);
    }

    imgStream.pipe(res);

    return;
  }

  // Default route for existing API calls
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));

});

// Start server only if run directly
if (require.main === module) {
  server.listen(7799, () => {
    console.log('fileProxy listening on http://localhost:7799');
  });
}

// Export for testing
module.exports = server;
