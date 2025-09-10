// /jtf: vanilla JS, no Node-specific APIs, works in browser or embedded JS runtimes.
function hexToBytes(hex) {
  if (hex.length % 2) throw new Error("Invalid hex length");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function readLEUint(bytes, offset, byteLen) {
  // returns Number for <=6 bytes, BigInt for 8 bytes
  if (byteLen === 8) {
    // 8 bytes → BigInt
    let res = 0n;
    for (let i = 0; i < 8; i++) {
      res |= BigInt(bytes[offset + i]) << BigInt(8 * i);
    }
    return res;
  } else {
    let v = 0;
    for (let i = 0; i < byteLen; i++) v |= bytes[offset + i] << (8 * i);
    return v >>> 0;
  }
}

function varIntRead(bytes, offset) {
  const first = bytes[offset];
  if (first < 0xfd) return { value: first, size: 1 };
  if (first === 0xfd) return { value: readLEUint(bytes, offset + 1, 2), size: 3 };
  if (first === 0xfe) return { value: readLEUint(bytes, offset + 1, 4), size: 5 };
  if (first === 0xff) {
    // 8-byte uint (BigInt)
    const big = readLEUint(bytes, offset + 1, 8);
    return { value: big, size: 9 };
  }
  throw new Error("Invalid varint prefix");
}

function bytesToHex(bytes, start=0, len=bytes.length-start) {
  let s = "";
  for (let i = 0; i < len; i++) {
    const v = bytes[start + i];
    s += (v < 16 ? "0" : "") + v.toString(16);
  }
  return s;
}

function hexLEToHexBE(hexLE) {
  // convert little-endian hex string to big-endian hex
  if (hexLE.length % 2) throw new Error("odd hex length");
  let out = "";
  for (let i = hexLE.length - 2; i >= 0; i -= 2) out += hexLE.substr(i, 2);
  return out;
}

function detectScriptType(scriptHex) {
  // simple heuristics
  if (scriptHex.startsWith("76a914") && scriptHex.endsWith("88ac") && scriptHex.length === (6 + 40 + 4)) {
    // 0x76 OP_DUP 0xa9 OP_HASH160 0x14 push20 <20> 0x88 OP_EQUALVERIFY 0xac OP_CHECKSIG
    const pubKeyHash = scriptHex.substr(6, 40);
    return { type: "p2pkh", addressHash: pubKeyHash };
  }
  if (scriptHex.startsWith("a914") && scriptHex.endsWith("87") && (scriptHex.length === (4 + 40 + 2))) {
    // OP_HASH160 push20 <20> OP_EQUAL
    const hash = scriptHex.substr(4, 40);
    return { type: "p2sh", addressHash: hash };
  }
  if (scriptHex.startsWith("6a")) {
    // OP_RETURN <data>
    return { type: "op_return", dataHex: scriptHex.substr(2) };
  }
  return { type: "unknown", asm: scriptHex };
}

function decodeRawTransaction(txHex) {
  if (typeof txHex !== "string") throw new Error("hex string required");
  txHex = txHex.trim().toLowerCase();
  const bytes = hexToBytes(txHex);
  let idx = 0;

  const version = readLEUint(bytes, idx, 4); idx += 4;

  // Check for segwit marker (not supported in this decoder)
  if (bytes[idx] === 0x00 && bytes[idx + 1] === 0x01) {
    throw new Error("SegWit transactions are not supported by this decoder (marker=00 01).");
  }

  // vin
  const vinVar = varIntRead(bytes, idx);
  const vinCount = vinVar.value;
  idx += vinVar.size;

  const vin = [];
  for (let i = 0; i < vinCount; i++) {
    const prevTxLE = bytesToHex(bytes, idx, 32); // little-endian txid
    const prevTxid = hexLEToHexBE(prevTxLE); // big-endian txid
    idx += 32;
    const prevOutIndex = readLEUint(bytes, idx, 4); idx += 4;

    // scriptSig length (varint)
    const scLenVar = varIntRead(bytes, idx);
    const scriptLen = scLenVar.value;
    idx += scLenVar.size;

    const scriptSig = bytesToHex(bytes, idx, Number(scriptLen)); // scriptLen fits in Number
    idx += Number(scriptLen);

    const sequence = readLEUint(bytes, idx, 4); idx += 4;

    vin.push({
      txid: prevTxid,
      vout: prevOutIndex,
      scriptSigHex: scriptSig,
      sequence: sequence >>> 0
    });
  }

  // vout
  const voutVar = varIntRead(bytes, idx);
  const voutCount = voutVar.value;
  idx += voutVar.size;

  const vout = [];
  for (let i = 0; i < voutCount; i++) {
    const valueSat = readLEUint(bytes, idx, 8); idx += 8; // BigInt
    // scriptPubKey length
    const scriptLenVar = varIntRead(bytes, idx);
    const scriptLen = scriptLenVar.value;
    idx += scriptLenVar.size;
    const scriptHex = bytesToHex(bytes, idx, Number(scriptLen));
    idx += Number(scriptLen);

    const sType = detectScriptType(scriptHex);

    vout.push({
      valueSatoshis: typeof valueSat === "bigint" ? valueSat.toString() : valueSat,
      valueBTC: (typeof valueSat === "bigint")
        ? (Number(valueSat) / 1e8).toString()
        : (valueSat / 1e8).toString(),
      scriptPubKeyHex: scriptHex,
      scriptType: sType
    });
  }

  const locktime = readLEUint(bytes, idx, 4); idx += 4;

  return {
    version: version >>> 0,
    vinCount: Number(vinCount),
    vin: vin,
    voutCount: Number(voutCount),
    vout: vout,
    locktime: locktime >>> 0,
    rawHex: txHex
  };
}

/*
var txHex;
fileProxy.read("decoy.raw").then(x => x.text()).then(x => txHex = x)

console.log(txHex);

const parsed = decodeRawTransaction(txHex);
console.log(JSON.stringify(parsed, null, 2));
*/
