import { privateDecrypt, publicEncrypt } from "crypto";

// Returns a base64-encoded ciphertext safe to store in the database.
export function encryptNIC(plaintext: string): string {
  const pubKeyB64 = process.env.NIC_SSH_PUB_KEY_B64;
  if (!pubKeyB64) {
    console.error("[encryptNIC] NIC_SSH_PUB_KEY_B64 not set in .env");
    throw new Error("NIC_SSH_PUB_KEY_B64 not set in .env");
  }

  try {
    // Decode base64 → PKCS1 PEM string, then encrypt
    const publicKey = Buffer.from(pubKeyB64, "base64").toString("utf8");
    const buffer = Buffer.from(plaintext, "utf8");
    const encrypted = publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  } catch (error) {
    console.error("[encryptNIC] Encryption failed:", error);
    throw error;
  }
}

// Decrypts a base64 ciphertext NIC using the RSA private key.
// Returns the original plaintext NIC string.
export function decryptNIC(ciphertext: string): string {
  const privKeyB64 = process.env.NIC_SSH_PRIV_KEY_B64;
  if (!privKeyB64) {
    console.error("[decryptNIC] NIC_SSH_PRIV_KEY_B64 not set in .env");
    throw new Error("NIC_SSH_PRIV_KEY_B64 not set in .env");
  }

  try {
    // Decode base64 → PKCS1 PEM string, then decrypt
    const privateKey = Buffer.from(privKeyB64, "base64").toString("utf8");
    const buffer = Buffer.from(ciphertext, "base64");
    const decrypted = privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("[decryptNIC] Decryption failed:", error);
    throw error;
  }
}
