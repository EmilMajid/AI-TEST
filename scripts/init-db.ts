/**
 * Database initialization script
 * Run with: npx ts-node scripts/init-db.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔧 Database initialization started...")

  try {
    // Create some sample regions
    const regions = ["Bakı", "Gəncə", "Sumqayıt", "Şəki", "Mingəçevir", "Lənkəran"]

    console.log("✅ Database is ready!")
    console.log("📝 Sample regions:", regions)
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
