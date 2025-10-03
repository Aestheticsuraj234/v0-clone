import { PrismaClient } from "@prisma/client";

const db = globalThis.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], 
})

if(process.env.NODE_ENV === "development"){
    globalThis.prisma = db
}

export default db;