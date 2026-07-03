import { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/app/_lib/prisma"
import { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
    }
  }

  interface User {
    id: string
  }
}

// Variável muito importante, pois vc pode resgatar a sessão do usuário logado
// passando ela como parâmetro da função getServerSession(authOptions)
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
      }
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
