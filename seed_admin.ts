import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "infoservicos@admin.com";
  const password = await bcrypt.hash("14082025", 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: password,
      role: "ADMIN",
    },
    create: {
      name: "Admin InfoServicos",
      email,
      passwordHash: password,
      role: "ADMIN",
    },
  });

  console.log("Admin criado/atualizado com sucesso:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
