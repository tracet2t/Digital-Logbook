import { decryptNIC, encryptNIC } from "@/lib/encryption";
import prisma from "@/lib/prisma";

async function migrate() {
  const apps = await prisma.menteeApplication.findMany();
  let count = 0;
  for (const app of apps) {
    if (!app.nic) continue;

    // Try decrypting — if it succeeds the record is already encrypted with the current key
    let alreadyEncrypted = false;
    try {
      decryptNIC(app.nic);
      alreadyEncrypted = true;
    } catch {
      // Decryption failed → value is either plaintext or encrypted with a different/old key
    }

    if (!alreadyEncrypted) {
      await prisma.menteeApplication.update({
        where: { id: app.id },
        data: { nic: encryptNIC(app.nic) },
      });
      console.log(`Encrypted NIC for ${app.email}`);
      count++;
    }
  }
  console.log(`Done. Encrypted ${count} NICs.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
