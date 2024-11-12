import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
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
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                try {
                    const res = await fetch("https://lacos-v2-2.onrender.com/login", {
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
            if (user?.token) {
                token.jwt = user.token; // Atribui o token ao JWT
            } else if (!token.jwt) {
                // Se não houver token, você pode adicionar uma validação extra, como gerar um novo token ou redirecionar para logout
                token.jwt = null;
            }
            return token;
        },
        async session({ session, token }) {
            session.jwt = token.jwt as string;
            return session;
        }
    },
    
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // Token válido por 30 dias (pode ser alterado)
        updateAge: 24 * 60 * 60, // Atualiza o token a cada 24h
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
