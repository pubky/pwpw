import { Buffer } from "buffer";

const algorithmName = 'AES-GCM'; // or 'AES-GCM' based on your requirements
const keyLength = 256; // in bits

// Helper functions for encoding and decoding
function hexStringToBuffer(hexString: string): Buffer {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  return Buffer.from(hexString, 'hex');
}

function bufferToHexString(buffer: Buffer): string {
  return buffer.toString('hex');
}

function stringToBuffer(str: string): Buffer {
  return Buffer.from(str, 'utf-8');
}

function bufferToString(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

function generateIV(): Buffer {
  // AES-CBC requires a 16-byte IV
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16)));
}

// Function to import the secret key
async function importKey(secretKeyHex: string): Promise<CryptoKey> {
  const keyBuffer = hexStringToBuffer(secretKeyHex);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: algorithmName, length: keyLength },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt and encode
export async function encodeData(data: any, secretKey: string): Promise<Buffer> {
  const cryptoKey = await importKey(secretKey);

  const jsonString = JSON.stringify(data);
  const encodedData = stringToBuffer(jsonString);

  const iv = generateIV();

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: algorithmName, iv: iv },
    cryptoKey,
    encodedData.buffer
  );

  const ciphertextBuffer = Buffer.from(encryptedBuffer);

  // Convert IV and ciphertext to hex strings
  const ivHex = bufferToHexString(iv);
  const ciphertextHex = bufferToHexString(ciphertextBuffer);

  // Combine IV and ciphertext with a colon separator
  const combined = `${ivHex}:${ciphertextHex}`;

  // return combined;
  return Buffer.from(combined);
}

// Decode and decrypt
export async function decodeData(encryptedData: Buffer | Uint8Array, secretKey: string): Promise<any> {
  const cryptoKey = await importKey(secretKey);

  // Split the string by the colon separator
  const string = Buffer.from(encryptedData).toString()
  const components = string.split(':');
  if (components.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }

  const ivHex = components[0];
  const ciphertextHex = components[1];

  const iv = hexStringToBuffer(ivHex);
  const ciphertext = hexStringToBuffer(ciphertextHex);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: algorithmName, iv: iv },
    cryptoKey,
    ciphertext.buffer
  );

  const decryptedString = bufferToString(Buffer.from(decryptedBuffer));
  const payload = JSON.parse(decryptedString);
  return payload;
}

