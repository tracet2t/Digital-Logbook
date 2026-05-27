import { encryptNIC } from "@/lib/encryption";
import prisma from "@/lib/prisma";

async function migrate() {
  const apps = await prisma.menteeApplication.findMany();
  let count = 0;
  for (const app of apps) {
    const isPlaintext = app.nic && !app.nic.endsWith("==");
    if (isPlaintext) {
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
