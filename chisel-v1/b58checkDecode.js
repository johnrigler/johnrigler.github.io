const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Decode(str) {
  let num = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const index = BASE58_ALPHABET.indexOf(str[i]);
    if (index === -1) throw new Error("Invalid Base58 character");
    num = num * 58n + BigInt(index);
  }

  // Handle leading zeros
  let bytes = [];
  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }

  const hex = num.toString(16).padStart(2 * Math.ceil(num.toString(2).length / 8), '0');
  const dataBytes = hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
  return Uint8Array.from([...bytes, ...dataBytes]);
}

function sha256Bytes(data) {
  const words = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(data)).words;
  return Uint8Array.from(words.flatMap(w => [(w >>> 24) & 255, (w >>> 16) & 255, (w >>> 8) & 255, w & 255]));
}

function b58checkDecode(address) {
  const raw = base58Decode(address);
  if (raw.length < 4) throw new Error("Too short for Base58Check");

  const version = raw[0];
  const payload = raw.slice(0, -4);
  const checksum = raw.slice(-4);
  const hash = sha256Bytes(sha256Bytes(payload)).slice(0, 4);

  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new Error("Bad base58 checksum");
    }
  }

  const hash160 = payload.slice(1); // remove version byte
  return {
    version,
    hash: hash160,
    hex: [...hash160].map(b => b.toString(16).padStart(2, '0')).join('')
  };
}

window.b58checkDecode = b58checkDecode;

