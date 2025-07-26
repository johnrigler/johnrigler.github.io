

dgb = [];
outputs = [];

dgb.chainz = [];
dgb.chainz.txinfo =   hash => fetch("https://chainz.cryptoid.info/dgb/api.dws?q=txinfo&t=" + hash).then( x => x.json())
dgb.chainz.txinfo =   hash => fetch("https://chainz.cryptoid.info/dgb/api.dws?key=2c8cf5f8ed4e&q=txinfo&t=" + hash).then( x => x.json())
dgb.chainz.api =   ( q,hash ) => fetch("https://chainz.cryptoid.info/dgb/api.dws?key=2c8cf5f8ed4e&q=" + q + "&t=" + hash).then( x => x.json())


//  const sha256 = b => CryptoJS.SHA256(CryptoJS.lib.WordArray.create(b)).words
  //    .reduce((a,w)=>a.concat([(w>>>24)&255,(w>>>16)&255,(w>>>8)&255,w&255]),[]);
  const dblSha256 = b => sha256(Uint8Array.from(sha256(b)));

function asciiToHex(str) {
  return Array.from(str).map(c =>
    c.charCodeAt(0).toString(16).padStart(2, '0')
  ).join('');
}



/*

D5*		DE		DP		SQ		SZ		Si
D6		DF		DQ		SR		Sa		Sj
D7		DG		DR		SS		Sb		Sk*
D8		DH		DS		ST		Sc	
D9		DJ		DT		SU		Sd
DA		DK		DU*		SV		Se
DB		DL		SM*		SW		Sf
DC		DM		SN		SX		Sg
DD		DN		SP		SY		Sh

* partial, ignore

*/

dgb.thunder = 'DDDDDDDDDDDDDDDDDDDDDDDDDDDD5SVJPi'

dgb.query = function(method, params = []) {
  // if called with no arguments → print usage help
  if (arguments.length === 0) {
    console.log('Usage: dgb("rpcMethod", [param1, param2, ...])');
    fetch("http://127.0.0.1:7788").then( x => x.json() ).then ( x => console.log(x) )
  
    console.log('Example: dgb("getblockhash", [21700539])');
    return Promise.resolve();      // nothing to fetch
  }

  if (!Array.isArray(params)) {
    throw new Error('params must be an array, e.g. [21700539]');
  }

  return fetch('http://127.0.0.1:7788/', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: 'web',
      method,
      params
    })
  }).then(r => r.json());
}

dgb.help = function( parms = "") 
   { 
   dgb.query("help", [parms])
         .then( x => x.result )
         .then( x => x)
         .then( console.log ) 
   }

dgb.gbc = () => dgb.query("getblockcount").then(r => r.result);
dgb.gbh = height => dgb.query("getblockhash", [height]).then(r => r.result);
dgb.gb_0 = hash => dgb.query("getblock", [hash,0]).then(r => r.result);
dgb.gb_1 = hash => dgb.query("getblock", [hash,1]).then(r => r.result);
dgb.gb_2 = hash => dgb.query("getblock", [hash,2]).then(r => r.result);
dgb.grt_0 = hash => dgb.query("getrawtransaction",[hash,0]).then( r => r.result);
dgb.grt_1 = hash => dgb.query("getrawtransaction",[hash,1]).then( r => r.result);
dgb.feerate = () => dgb.query("estimatesmartfee",[6]).then( x => x.result ).then( x => x.feerate )
dgb.usage = () => dgb.query()

dgb.findUTXO = () => dgb.query("listunspent")
  .then(x => x.result)
  .then(results => {
    return results
      .filter(utxo => utxo.label && utxo.label.startsWith("extern"))
      .map(utxo => ({
        txid: utxo.txid,
        vout: utxo.vout
      }));
  }); 

// outputs.push("{data: " + toHex("Web3 must be hacked into POW ledgers.") + "}" )

dgb.chiselWChange = function buildChiselTxWithChange(utxos, tablet, opret, changeAddress, fee = 0.0001, burn = 0.00001132) {
  const toHex = (s) => /^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0
    ? s.toLowerCase()
    : Array.from(new TextEncoder().encode(s)).map(b => b.toString(16).padStart(2, '0')).join('');

  const opretHex = toHex(opret);
  const outputs = [];

  // Add burn outputs
  tablet.forEach(addr => {
    const clean = addr.trim();
    if (!clean.toLowerCase().startsWith("change") && !clean.includes("instruction")) {
      const o = {};
      o[clean] = burn;
      outputs.push(o);
    }
  });

  // Add OP_RETURN
  outputs.push({ data: opretHex });

  // Calculate total output value
  const totalOutput = outputs
    .filter(o => !o.data)
    .reduce((sum, o) => sum + Object.values(o)[0], 0);

  const totalCost = totalOutput + fee;

  // Select UTXOs until we meet or exceed cost
  let totalInput = 0;
  const inputs = [];
  for (let utxo of utxos) {
    inputs.push({ txid: utxo.txid, vout: utxo.vout });
    totalInput += utxo.amount;
    if (totalInput >= totalCost) break;
  }

  if (totalInput < totalCost) {
    throw new Error(`Insufficient funds: need ${totalCost}, have ${totalInput}`);
  }

  // Add change output if there's leftover
  const change = +(totalInput - totalCost).toFixed(8);
  if (change > 0) {
    const c = {};
    c[changeAddress] = change;
    outputs.push(c);
  }

  return [inputs, outputs];
}

dgb.chiselExplicit = function buildChiselTxWithExplicitChange(utxos, tablet, opret, fee = 0.0001, burn = 0.0001132) {
  const toHex = (s) =>
    /^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0
      ? s.toLowerCase()
      : Array.from(new TextEncoder().encode(s))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

  const opretHex = toHex(opret);
  const outputs = [];

  // Look for bech32 or tagged "change:" address in the tablet
  const changeAddr = tablet.find(x =>
    x.startsWith("dgb1") || x.toLowerCase().startsWith("change:")
  )?.replace(/^change:\s*/i, '');

  const filteredTablet = tablet.filter(x => {
    const addr = x.toLowerCase();
    return !addr.startsWith("change:") && !addr.startsWith("dgb1") && !addr.includes("instruction");
  });

  // Burn outputs
  filteredTablet.forEach(addr => {
    const o = {};
    o[addr] = burn;
    outputs.push(o);
  });

  // OP_RETURN
  outputs.push({ data: opretHex });

  // Calculate totals
  const totalOutput = outputs
    .filter(o => !o.data)
    .reduce((sum, o) => sum + Object.values(o)[0], 0);

  const totalCost = totalOutput + fee;

  // Input selection
  let totalInput = 0;
  const inputs = [];
  for (let utxo of utxos) {
    inputs.push({ txid: utxo.txid, vout: utxo.vout });
    totalInput += utxo.amount;
    if (totalInput >= totalCost) break;
  }

  if (totalInput < totalCost) {
    throw new Error(`Insufficient funds: need ${totalCost}, have ${totalInput}`);
  }

  // Assign leftover to changeAddr if present
  const change = +(totalInput - totalCost).toFixed(8);
  if (changeAddr && change > 0) {
    const o = {};
    o[changeAddr] = change;
    outputs.push(o);
  }

  return [inputs, outputs];
}

dgb.createRawTabletTx = function(utxo, tablet, opret) {
  const toHex = (s) => {
    if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) return s.toLowerCase();
    return Array.from(new TextEncoder().encode(s))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const opretHex = toHex(opret);
  const outputs = [];

  const burnValue = 0.00001132;

  tablet.forEach(addr => {
    const normalized = addr.trim();
    if (
      !normalized.toLowerCase().startsWith("change") &&
      !normalized.toLowerCase().includes("instruction")
    ) {
      const obj = {};
      obj[normalized] = burnValue;
      outputs.push(obj);
    }
  });

  // Final OP_RETURN
  outputs.push({ data: opretHex });

  return [
    utxo,  // must be array of UTXO objects
    outputs  // outputs as array of single-key objects
  ];
}


dgb.chainz = [];
dgb.chainz.txinfo =   hash => fetch("https://chainz.cryptoid.info/dgb/api.dws?q=txinfo&t=" + hash).then( x => x.json())
dgb.chainz.txinfo =   hash => fetch("https://chainz.cryptoid.info/dgb/api.dws?key=2c8cf5f8ed4e&q=txinfo&t=" + hash).then( x => x.json())
dgb.chainz.api =   ( q,hash ) => fetch("https://chainz.cryptoid.info/dgb/api.dws?key=2c8cf5f8ed4e&q=" + q + "&t=" + hash).then( x => x.json())


// dgb.chainz.getbalance = () => fetch("https://chainz.cryptoid.info/dgb/api.dws?key=2c8cf5f8ed4e&q=getbalance&a=DATUGu64TCU4qD7vDC5hUYmyfRmEJcGM3J").then( x => x.json(())

/* ── helper: best‑effort hex → UTF‑8 ──────────────────────────────── */
function hexToUtf8(hex) {
  if (!hex || hex.length % 2) return null;           // must be even length

  /* -------- Node (has Buffer) -------------------- */
  if (typeof Buffer !== 'undefined') {
    try { return Buffer.from(hex, 'hex').toString('utf8'); }
    catch { return null; }
  }

  /* -------- Browser TextDecoder ------------------ */
  if (typeof TextDecoder !== 'undefined') {
    try {
      const bytes = new Uint8Array(hex.match(/../g).map(b => parseInt(b, 16)));
      return new TextDecoder('utf-8').decode(bytes);
    } catch { /* fall through */ }
  }

  /* -------- Fallback (old browsers) -------------- */
  try {
    // create a percent‑encoded string and run decodeURIComponent
    const escaped = hex.match(/../g).map(b => '%' + b).join('');
    return decodeURIComponent(escaped);
  } catch { return null; }
}


/* ── dgb.parseTx ─────────────────────────────────────────── */
dgb.parseTx = hash =>
  dgb.grt_1(hash).then(tx =>
    tx.vout.map(out =>
      out.value === 0
        ? {
            type : 'op_return',
            hex  : out.scriptPubKey.hex.slice(4),          // data bytes
            text : hexToUtf8(out.scriptPubKey.hex.slice(4))// decoded UTF‑8 (may be null)
          }
        : {
            type    : 'output',
            address : out.scriptPubKey.address,
            value   : out.value
          }
    )
  );


function utf8ToHex(str) {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

dgb.buildchiselTx = function buildChiselTx(utxos, [tablet, opRetStr, tipAmount]) {
  const BURN_AMOUNT = 0.00001132;

  if (!Array.isArray(tablet)) throw new Error("Tablet must be an array of addresses.");

  const inputs = Array.isArray(utxos) ? utxos : utxos.result;
  if (inputs.length === 0) throw new Error("No inputs provided.");

  const totalIn = inputs.reduce((sum, u) => sum + u.amount, 0);
  const changeAddr = inputs[0].address;

  const totalBurn = BURN_AMOUNT * tablet.length;
  const op_return_hex = utf8ToHex(opRetStr);
  const change = totalIn - totalBurn - tipAmount;

  if (change < 0) throw new Error("Not enough input for burn + tip.");

  // Build outputs in exact order
  const outputs = [];

  // Tablet burns first
  tablet.forEach(addr => {
    outputs.push({ [addr] : BURN_AMOUNT });
  });

  // Then change
  outputs.push({ [changeAddr] : parseFloat(change.toFixed(8)) } );

  // Then OP_RETURN
  outputs.push({ data: op_return_hex });


  return [
    inputs.map(u => ({ txid: u.txid, vout: u.vout })),
    outputs // This is NOT an object
  ];
}



/*
https://digibyteblockexplorer.com/address/DBxYoUTUBEvCoMzzzzzzzzzzzzzzZ31xMU

[
  {
    "type": "output",
    "address": "DBx…",
    "value": 0.00006
  },
  {
    "type": "op_return",
    "hex": "48656c6c6f2c20e4b896e7958c20f09f9883",
    "text": "Hello, 世界 😊"
  }
]

*/
/**
 * jq‑style JSON logger for browser DevTools.
 * Usage: jqLog(objOrJsonString);
 */
function jqLog(input, scheme = {}) {
  // default jq‑inspired palette (tweak via second arg)
  const c = {
    key:      'color:#8ae234',      // bright green
    string:   'color:#729fcf',      // blue
    number:   'color:#fce94f',      // yellow
    boolean:  'color:#ad7fa8',      // magenta
    null:     'color:#ef2929',      // red
    punct:    'color:#888',         // gray
    ...scheme
  };

  // stringify once; indent = 2
  const src = typeof input === 'string' ? input : JSON.stringify(input, null, 2);

  // regex finds every structural/primitive token
  const rx = /"(\\u[\da-f]{4}|\\[^u]|[^\\"])*"(?=:)|"(\\u[\da-f]{4}|\\[^u]|[^\\"])*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?/gi;

  const seg = [];       // [%cTEXT, ...]
  const sty = [];       // CSS per %c

  let i = 0;
  src.replace(rx, (m, _, __, idx) => {
    // push inter‑token punctuation (whitespace, braces, commas …)
    if (i < idx) {
      seg.push('%c' + src.slice(i, idx));
      sty.push(c.punct);
    }

    // classify matched token
    let s;
    if (m[0] === '"') {
      s = m.endsWith(':') ? c.key : c.string;
    } else if (m === 'true' || m === 'false') {
      s = c.boolean;
    } else if (m === 'null') {
      s = c.null;
    } else {
      s = c.number; // number
    }

    seg.push('%c' + m);
    sty.push(s);

    i = idx + m.length;
  });

  // trailing punctuation
  if (i < src.length) {
    seg.push('%c' + src.slice(i));
    sty.push(c.punct);
  }

  console.log(seg.join(''), ...sty);
}

/*
fetch("http://127.0.0.1:8080/input1.json").then( x => x.text())
     .then( x => { 
         jqLog(x)
         txArgs = JSON.parse(x) 
         } )
*/
/* ── helpers ----------------------------------------------------------- */
function varInt(n){
  if(n<0xfd)        return n.toString(16).padStart(2,'0');
  if(n<=0xffff)     return 'fd'+u32LE(n).slice(0,4);
  if(n<=0xffffffff) return 'fe'+u32LE(n);
  return 'ff'+u64LE(BigInt(n));
}

dgb.filterObviously = function filterObviously(data) {
  const utxos = Array.isArray(data) ? data : data.result;
  return utxos.filter(utxo => !/^D[ABCDE]x/.test(utxo.address));
}

function b58decode(str){
  let num=0n;
  for(const ch of str) num = num*58n + BigInt(B58.indexOf(ch));
  let hex = num.toString(16); if(hex.length&1) hex='0'+hex;
  for(let i=0;i<str.length&&str[i]==='1';i++) hex='00'+hex;
  return hex;
}
function p2pkhScript(address){
  const hex = b58decode(address);
  const hash160 = hex.slice(2,-8);               // drop version + checksum
  return '76a914'+hash160+'88ac';                // OP_DUP OP_HASH160 <20B> OP_EQUALVERIFY OP_CHECKSIG
}



function p2shScript(addr) {
  const hash160 = b58checkDecode(addr).hex;
  return 'a914' + hash160 + '87';
}


function p2pkhScriptUnvalidated(addr) {
  // decode base58check without validating prefix
  const b58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = BigInt(0);
  for (let c of addr) {
    num = num * 58n + BigInt(b58.indexOf(c));
  }

  let hex = num.toString(16).padStart(50, '0'); // 25 bytes = 50 hex chars
  let pubKeyHash = hex.slice(2, 42);            // skip version (1 byte) and checksum (4 bytes)
  return '76a914' + pubKeyHash + '88ac';        // OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG
}


/* ── serializer -------------------------------------------------------- */
dgb.buildRaw = function buildRaw(args, version=2, locktime=0){
  const [ins, outs] = args;
  let hex = u32LE(version);                      // version

  /* inputs */
  hex += varInt(ins.length);
  for(const vin of ins){
    hex += vin.txid.match(/../g).reverse().join(''); // txid LE
    hex += u32LE(vin.vout);
    hex += '00';                                    // empty scriptSig
    hex += u32LE(0xffffffff);
  }

  /* outputs */
  hex += varInt(outs.length);
  outs.forEach(o=>{
    if(o.data!==undefined){                        // OP_RETURN
      const dataHex   = o.data.toLowerCase();
      const opReturn  = '6a'+varInt(dataHex.length/2)+dataHex;
      hex += u64LE(0n);                            // value = 0
      hex += varInt(opReturn.length/2) + opReturn;
    }else{
      const addr = Object.keys(o)[0];
      const sats = BigInt(Math.round(o[addr]*1e8));
  //    const pk   = p2pkhScript(addr);
  //    const pk = p2pkhScriptUnvalidated(addr);

   let pk;
    if(addr[0] === 'S'){
      pk = p2shScript(addr);  // fake it, doesn't support actual "S" 
      } else {
      pk = p2pkhScript(addr); // default to P2PKH
      }


      hex += u64LE(sats);
      hex += varInt(pk.length/2) + pk;
    }
  });

  hex += u32LE(locktime);
  return hex.toLowerCase();
}

dgb.show = function(tx = "11c6cb1998c665f2a9bd79fd0547994ae132a7ac6ef98aeff57069b60269b9d3") {
dgb.grt_1(tx)
  .then(result => {
    const div = document.querySelector("div");
    div.innerHTML = ""; // clear existing

    const pre = document.createElement("pre");
    const lines = [];

    for (let key in result) {
      if (key === "blockhash") {
        const lineStart = `"${key}": "`;
        const lineEnd = '",\n';

        // Static text node for start of line
        lines.push(document.createTextNode(lineStart));

        // Link node
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = result[key];
        link.style.color = "blue";
        link.onclick = (e) => {
          e.preventDefault();
          dgb.gb_2(result[key])
            .then(res => {
              div.innerHTML = "<pre>" + JSON.stringify(res, null, 2) + "</pre>";
            })
            .catch(err => {
              div.innerText = "Error: " + err;
            });
        };
        lines.push(link);

        // Static text node for end of line
        lines.push(document.createTextNode(lineEnd));
      } else {
        lines.push(document.createTextNode(`"${key}": "${result[key]}",\n`));
      }
    }

    lines.forEach(line => pre.appendChild(line));
    div.appendChild(pre);
  })
  .catch(err => {
    document.querySelector("div").innerText = "Error: " + err;
  });
}

dgb.query("listunspent").then( result => dgb.utxo = dgb.filterObviously(result) )

/* ── run & verify ------------------------------------------------------ */
/*
fetch("http://127.0.0.1:8080/blobimge.json").then( x => x.text())
     .then( x => {
         jqLog(x)
         txArgs = JSON.parse(x)
         const raw = dgb.buildRaw(txArgs);
         console.log(raw);
         })
*/
// 0200000001630f9c5472a8156594f5a0e45676be75b69cd817bc74007e7b807ee1589234a30000000000ffffffff0370170000000000001976a9144ab91aa91c29b570f982eb485ee909eb0e84e0b088ac70170000000000001976a91455c0355b8a6c08885bf229c31c9a0cd538c2e9b588ac0000000000000000036a010000000000

