import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session {
      jwt?: string;
    }
  }

const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                try {
                    const res = await fetch("https://lacos-v2.fly.dev/login", {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        })
                    });

                    if (res.status !== 202) return null;

                    const authData = await res.json();
                    if (!authData.token) return null;

                    return {
                        id: credentials.username,
                        name: credentials.username,
                        email: `${credentials.username}@example.com`,
                        token: authData.token
                    };

                } catch (e) {
                    console.error("Erro ao autenticar:", e);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && 'token' in user) { // Verificação se 'token' existe em 'user'
                token.jwt = user.token; // Atribui o token ao JWT
            } else if (!token.jwt) {
                token.jwt = null; // Se não houver token, define como null
            }
            return token;
        },
        async session({ session, token }) {
            session.jwt = token.jwt as string; // Atribui o JWT na sessão
            return session;
        }
    }
    ,

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };

