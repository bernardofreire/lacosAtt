'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster";

export function AuthForm() {
    const form = useForm();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { toast } = useToast()

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            const Api = await fetch(
                apiUrl + "/login",
                {
                    method: 'POST',
                    body: JSON.stringify({
                        "username": data.username,
                        "password": data.password
                    })
                });


            let apiResponse = await Api.json();

            if (apiResponse.status_code === 202) {
                // Armazenar o token no localStorage
                localStorage.setItem('token', apiResponse.token);

                // Exibir toast de sucesso
                toast({
                    title: "Login bem-sucedido",
                    description: "Você será redirecionado em breve...",
                });

                // Redirecionar após um pequeno delay para que o toast apareça
                setTimeout(() => {
                    router.push('/app');
                }, 2000); // 2 segundos de delay antes do redirecionamento
            } else {
                // Tratar erro de login e mostrar toast de erro
                toast({
                    title: "Erro no login",
                    description: "Usuário ou senha incorretos.",
                    variant: "destructive", // Variante para exibir como erro
                });
            }

        } catch (error) {
            console.error('Erro ao tentar logar', error);

            // Mostrar um toast de erro genérico
            toast({
                title: "Erro no login",
                description: "Ocorreu um erro. Tente novamente.",
                variant: "destructive",
            });
        }



    });

    return (
        <main>
            <div className="h-screen flex justify-center items-center p-4">
                <div className="flex flex-col md:flex-row items-center justify-around  h-auto w-full max-w-3xl p-6 rounded-lg">
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
                    <form onSubmit={handleSubmit} className="p-6  flex flex-col justify-around h-full w-full md:w-1/2">
                        <h1 className="mb-4">Login</h1>
                        <div className="flex flex-col space-y-4">
                            {/* Inputs maiores e responsivos */}
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
                        {/* Botão maior e responsivo */}
                        <Button className="bg-purple-800 w-full py-3 mt-6">
                            Conectar
                        </Button>
                    </form>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
