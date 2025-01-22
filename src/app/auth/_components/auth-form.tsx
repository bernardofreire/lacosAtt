'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export function AuthForm() {
    const form = useForm();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams(); // Hook que usa os parâmetros da URL

    // Use useEffect para atualizar o erro ao mudar os parâmetros de busca na URL
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(errorParam);
        }
    }, [searchParams]);

    const handleSubmit = form.handleSubmit(async (data) => {
        setIsLoading(true);
        console.log(data);

        const result = await signIn("credentials", {
            redirect: false,
            ...data,
            callbackUrl: '/app'
        });

        if (result?.error) {
            console.error("Erro no login:", result.error);
            toast({
                variant: "destructive",
                title: "Erro no login",
                description: "Verifique suas credenciais.",
            });
        } else if (result?.url) {
            router.push(result.url); // Redireciona ao sucesso
        }

        setIsLoading(false); // Finaliza o carregamento
    });

    return (
        <main>
            <div className="h-screen flex justify-center items-center p-4">
                <div className="flex flex-col md:flex-row items-center justify-around h-auto w-full max-w-3xl p-6 rounded-lg">
                    <div className="mb-4 md:mb-0">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={400}
                            height={400}
                            draggable={false}
                        />
                    </div>
                    <div className="px-10">
                        <Image
                            src="/images/vetor.png"
                            alt="Vetor"
                            width={5}
                            height={5}
                            draggable={false}
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col justify-around h-full w-full md:w-1/2">
                        <h1 className="mb-4">Login</h1>
                        <div className="flex flex-col space-y-4">
                            <Input
                                className="focus:border-purple-800 w-full py-3"
                                type="username"
                                placeholder="Digite o usuário"
                                {...form.register('username')}
                            />
                            <Input
                                className="focus:border-purple-800 w-full py-3"
                                type="password"
                                placeholder="Digite a senha"
                                {...form.register('password')}
                            />
                        </div>
                        <Button
                            className="bg-purple-800 w-full py-3 mt-6 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Conectar"
                            )}
                        </Button>
                    </form>
                </div>
                {error === 'CredentialsSignin' && (
                    <div>Erro no login. Verifique suas credenciais.</div>
                )}
            </div>
            <Toaster />
        </main>
    );
}

// Envolva seu componente com Suspense
export default function AuthPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <AuthForm />
        </Suspense>
    );
}
