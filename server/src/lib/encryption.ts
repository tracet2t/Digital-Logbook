import { privateDecrypt, publicEncrypt } from "crypto";

export function encryptNIC(plaintext: string): string {
  const pubKeyB64 = process.env.NIC_SSH_PUB_KEY_B64;
  if (!pubKeyB64) throw new Error("NIC_SSH_PUB_KEY_B64 not set in .env");

  const publicKey = Buffer.from(pubKeyB64, "base64").toString("utf8");
  const buffer = Buffer.from(plaintext, "utf8");
  const encrypted = publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}

export function decryptNIC(ciphertext: string): string {
  const privKeyB64 = process.env.NIC_SSH_PRIV_KEY_B64;
  if (!privKeyB64) throw new Error("NIC_SSH_PRIV_KEY_B64 not set in .env");

  const privateKey = Buffer.from(privKeyB64, "base64").toString("utf8");
  const buffer = Buffer.from(ciphertext, "base64");
  const decrypted = privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
}
