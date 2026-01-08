import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Use DIRECT_URL for schema operations (migrations, db push)
    // Falls back to DATABASE_URL if DIRECT_URL not set
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"]!,
  },
});
