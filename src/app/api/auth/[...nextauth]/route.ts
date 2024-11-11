import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { cookies } from 'next/headers';

const handler = NextAuth({
    pages: {
        signIn: '/auth'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {},
                password: {}
            },

            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }


                try {
                    console.log(credentials)
                    const res = await fetch("/your/endpoint", {
                        method: 'POST',
                        body: JSON.stringify({
                            identifier: credentials.username,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" }
                    })
                    if (res.status !== 200) return null

                    const authData = await res.json();

                    if (!authData.jwt) return null

                    cookies().set("jwt", authData.jwt)

                    return {
                        email: authData.user.email,
                    }

                } catch (e) {
                    console.log(e)
                    return null
                }


            }
        })
    ]
})

export { handler as GET, handler as POST }
