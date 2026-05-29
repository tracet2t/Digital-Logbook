/**
 * NIC Key Rotation Script
 *
 * Usage:
 *   OLD_PRIV_KEY_B64=<old_base64_private_key> npx tsx --tsconfig tsconfig.json src/scripts/rotate-nic-keys.ts
 *
 * What it does:
 *   1. Reads every menteeApplication row from the DB
 *   2. Decrypts each NIC with the OLD private key (passed via env var)
 *   3. Re-encrypts with the NEW public key (read from NIC_SSH_PUB_KEY_B64 in .env)
 *   4. Updates the DB row
 *
 * Run this AFTER updating NIC_SSH_PUB_KEY_B64 / NIC_SSH_PRIV_KEY_B64 in .env
 * with the new key pair, but BEFORE restarting the app.
 */

import { constants, privateDecrypt, publicEncrypt } from "crypto";

import prisma from "@/lib/prisma";

function decryptWithKey(privKeyB64: string, ciphertext: string): string {
  const privateKey = Buffer.from(privKeyB64, "base64").toString("utf8");
  const buffer = new Uint8Array(Buffer.from(ciphertext, "base64"));
  const decrypted = privateDecrypt(
    { key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING },
    buffer,
  );
  return decrypted.toString("utf8");
}

function encryptWithKey(pubKeyB64: string, plaintext: string): string {
  const publicKey = Buffer.from(pubKeyB64, "base64").toString("utf8");
  const buffer = new Uint8Array(Buffer.from(plaintext, "utf8"));
  const encrypted = publicEncrypt(
    { key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING },
    buffer,
  );
  return encrypted.toString("base64");
}

async function rotate() {
  const oldPrivKeyB64 = process.env.OLD_PRIV_KEY_B64;
  const newPubKeyB64 = process.env.NIC_SSH_PUB_KEY_B64;

  if (!oldPrivKeyB64) {
    console.error("ERROR: OLD_PRIV_KEY_B64 env var is required.");
    console.error(
      "  Run: OLD_PRIV_KEY_B64=<base64> npx tsx ... rotate-nic-keys.ts",
    );
    process.exit(1);
  }

  if (!newPubKeyB64) {
    console.error(
      "ERROR: NIC_SSH_PUB_KEY_B64 not set in .env. Add the new public key first.",
    );
    process.exit(1);
  }

  const apps = await prisma.menteeApplication.findMany();
  let rotated = 0;
  let skipped = 0;
  let failed = 0;

  for (const app of apps) {
    if (!app.nic) {
      skipped++;
      continue;
    }

    let plaintext: string;
    try {
      plaintext = decryptWithKey(oldPrivKeyB64, app.nic);
    } catch {
      console.warn(
        `  SKIP ${app.email}: could not decrypt with old key (may already be rotated or is plaintext)`,
      );
      skipped++;
      continue;
    }

    try {
      const newCiphertext = encryptWithKey(newPubKeyB64, plaintext);
      await prisma.menteeApplication.update({
        where: { id: app.id },
        data: { nic: newCiphertext },
      });
      console.log(`  ✓ Rotated NIC for ${app.email}`);
      rotated++;
    } catch (err) {
      console.error(`  ✗ Failed to re-encrypt for ${app.email}:`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. Rotated: ${rotated}, Skipped: ${skipped}, Failed: ${failed}`,
  );

  if (failed > 0) {
    console.error("Some records failed — do NOT discard the old key yet.");
    process.exit(1);
  }
}

rotate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
