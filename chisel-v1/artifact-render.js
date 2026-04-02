// artifact-renderer.js
// Returns a renderer function: (targetDivOrId, opts) => Promise
// opts: { markup: string } OR { url: string, expectedHashHex: "..." }
// This is synchronous parsing; fetch/hash verification is optional async.
(function(){
  // ---------- small utilities ----------
  function toEl(idOrEl){
    if (typeof idOrEl === 'string') return document.getElementById(idOrEl);
    return idOrEl instanceof Element ? idOrEl : null;
  }

  function escapeHtml(s){
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Allow only these URL schemes:
  const ALLOWED_URL_SCHEMES = ['http:', 'https:', 'mailto:', 'ipfs:'];

  function isSafeUrl(urlStr){
    try {
      // allow relative URLs
      if (/^\s*\/|^\s*\./.test(urlStr)) return true;
      const u = new URL(urlStr, location.href);
      return ALLOWED_URL_SCHEMES.includes(u.protocol);
    } catch(e){
      return false;
    }
  }

  // Minimal markdown-ish parser producing only allowed tags.
  // Steps:
  //  1) escape whole text
  //  2) process code fences (```lang\n...\n```)
  //  3) process inline code `code`
  //  4) process headings (# ..)
  //  5) process blockquote lines starting with >
  //  6) process unordered lists lines starting with - or *
  //  7) process links [text](url) -> <a> only if URL safe
  //  8) bold **text** and italics *text*
  //  9) paragraphs split by double newline
  function renderMarkupToHtml(raw){
    if (!raw) return '';

    // Normalize line endings
    let s = raw.replace(/\r\n?/g, '\n');

    // escape everything first
    s = escapeHtml(s);

    // fence code blocks: produce <pre><code>...</code></pre>
    s = s.replace(/```(?:\w+)?\n([\s\S]*?)\n```/g, function(_, code){
      return `<pre><code>${code}</code></pre>`;
    });

    // inline code `code`
    s = s.replace(/`([^`]+)`/g, function(_, code){
      return `<code>${code}</code>`;
    });

    // headings (up to h3)
    s = s.replace(/^\s*######\s*(.+)$/gm, '<h6>$1</h6>');
    s = s.replace(/^\s*#####\s*(.+)$/gm, '<h5>$1</h5>');
    s = s.replace(/^\s*####\s*(.+)$/gm, '<h4>$1</h4>');
    s = s.replace(/^\s*###\s*(.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^\s*##\s*(.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^\s*#\s*(.+)$/gm, '<h1>$1</h1>');

    // blockquote lines: collapse consecutive > lines into one blockquote
    s = s.replace(/(?:^\s*&gt;.*(?:\n|$))+?/gm, function(block){
      const inner = block.replace(/^\s*&gt;\s?/gm, '').trim();
      return `<blockquote>${inner}</blockquote>\n`;
    });

    // unordered lists: lines starting with - or * (simple)
    s = s.replace(/(?:^\s*[-\*]\s+.+(?:\n|$))+?/gm, function(block){
      const items = block.trim().split(/\n+/).map(function(line){
        const m = line.match(/^\s*[-\*]\s+(.+)$/);
        return `<li>${m ? m[1] : line}</li>`;
      }).join('');
      return `<ul>${items}</ul>\n`;
    });

    // links [text](url) -> sanitize url
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, text, url){
      url = url.trim();
      if (!isSafeUrl(url)) {
        // render as plain text with url shown (but escaped)
        return `${escapeHtml(text)} (${escapeHtml(url)})`;
      }
      // safe: include noopener and noreferrer
      return `<a href="${escapeHtml(url)}" rel="noopener noreferrer" target="_blank">${text}</a>`;
    });

    // bold **text**
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic *text* (avoid interfering with already processed strong & tags)
    s = s.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, function(_, a, text, b){
      return `${a}<em>${text}</em>${b}`;
    });

    // collapse multiple newlines into paragraph breaks
    const parts = s.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

    // wrap paragraphs not already block-level tags
    const wrapped = parts.map(function(p){
      if (/^<(h[1-6]|ul|ol|pre|blockquote)/i.test(p)) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return wrapped;
  }


  // Render into target safely.
  function renderInto(targetEl, htmlContent){
    // small style block scoped using data attribute if not present
    if (!targetEl.dataset.artifactStyled){
      const style = document.createElement('style');
      style.textContent = `
        /* artifact renderer minimal styles */
        .artifact { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #111; background: white; }
        .artifact h1 { font-size: 1.6rem; margin: 0 0 .35rem; color: #444; text-transform: uppercase; letter-spacing: .06em; }
        .artifact .subtitle { color: #444; background: white; margin: 0 0 .7rem; font-size: .95rem; }
        .artifact p { margin: 0 0 .9rem; line-height: 1.45rem; color: #222; background: white }
        .artifact blockquote { border-left: 3px solid #e53935; margin: 0 0 .9rem; padding-left: .9rem; color: #555; }
        .artifact pre { background: #111; color: #eee; background: white; padding: .6rem; border-radius: 6px; overflow:auto; }
        .artifact code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace; background: #f4f4f4; padding: 0 .25rem; border-radius: 3px; }
      `;
      document.head.appendChild(style);
      targetEl.dataset.artifactStyled = '1';
    }

    // Clear and append. We use innerHTML but only with generated-safe HTML from renderMarkupToHtml
    targetEl.innerHTML = `<div class="artifact">${htmlContent}</div>`;
  }

  // Optional helper: compute SHA-1 hex of text for verification (uses SubtleCrypto)
  async function sha1Hex(str){
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hash = await crypto.subtle.digest('SHA-1', data);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  // Public function returned by this IIFE
  async function renderArtifact(target, opts){
    const el = toEl(target);
    if (!el) throw new Error('renderArtifact: target not found');

    // Accept either direct markup or fetch-from-url
    let markup = opts && opts.markup;
    if (!markup && opts && opts.url){
      // fetch over HTTPS only (disallow insecure schemes)
      if (!/^https:\/\//i.test(opts.url) && !/^ipfs:/i.test(opts.url)){
        throw new Error('Only HTTPS or ipfs: urls are allowed for remote fetch');
      }
      // If ipfs: scheme, you must resolve via your gateway (example placeholder)
      let fetchUrl = opts.url;
      if (/^ipfs:/i.test(opts.url)) {
        // convert ipfs:CID/path -> https://ipfs.io/ipfs/CID/path (you can choose gateway)
        fetchUrl = opts.url.replace(/^ipfs:\/\//,'').replace(/^ipfs:/,'');
        if (!/^\/?ipfs\//.test(fetchUrl)) fetchUrl = '/ipfs/' + fetchUrl;
        fetchUrl = 'https://ipfs.io' + fetchUrl;
      }
      const res = await fetch(fetchUrl, {cache: 'no-cache'});
      if (!res.ok) throw new Error('Failed to fetch artifact: ' + res.status);
      markup = await res.text();

      // optional verify expected hash if provided
      if (opts.expectedHashHex){
        const h = await sha1Hex(markup);
        if (h !== opts.expectedHashHex.toLowerCase()){
          throw new Error('Hash mismatch: expected ' + opts.expectedHashHex + ' got ' + h);
        }
      }
    }

    // now markup is a string: parse and render
    const safeHtml = renderMarkupToHtml(markup || '');
    renderInto(el, safeHtml);
    return true;
  };


// expose inside the IIFE
  window.chisel = window.chisel || {};
  window.chisel.renderArtifact = renderArtifact;

})(); 

