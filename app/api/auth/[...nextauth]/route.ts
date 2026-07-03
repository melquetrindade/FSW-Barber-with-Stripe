import { authOptions } from "@/app/_lib/auth"
import NextAuth from "next-auth"


// ARQUIVO IMPORTANTE (FAZ A INTEGRAÇÃO COM O NEXTAUTH, PRISMA E AUTENTICAÇÃO COM O GOOLE)
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
