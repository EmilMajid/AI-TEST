import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            process.env.POSTGRES_PRISMA_URL ||
            process.env.POSTGRES_URL ||
            "postgresql://postgres:postgres@localhost:5432/postgres",
        },
      },
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  } catch (error) {
    console.warn("[lib/db] Warning creating PrismaClient:", error)
    return new Proxy({} as PrismaClient, {
      get() {
        return () => Promise.resolve(null)
      },
    })
  }
}

// Lazy getter using Proxy to prevent initialization during Next.js build-time page collection
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    const instance = globalForPrisma.prisma as any
    const value = instance[prop]
    return typeof value === "function" ? value.bind(instance) : value
  },
})

export default prisma
