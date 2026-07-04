import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@fluidocredit.com";
  const password = "Fluido2026!";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      fullName: "Fluido Credit Admin",
      phone: "+0000000000",
      country: "France",
      countryCode: "+33",
      city: "Paris",
      address: "Fluido Credit HQ",
      postalCode: "75000",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      isActive: true,
    },
    create: {
      fullName: "Fluido Credit Admin",
      email,
      phone: "+0000000000",
      country: "France",
      countryCode: "+33",
      city: "Paris",
      address: "Fluido Credit HQ",
      postalCode: "75000",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      isActive: true,
    },
  });

  console.log("ADMIN CREATED OR UPDATED:");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("CREATE_ADMIN_ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });