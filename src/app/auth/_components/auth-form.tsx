'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useForm } from "react-hook-form";

export function AuthForm() {
    const form = useForm();

    const handleSubmit = form.handleSubmit(async (data) => {
        console.log(data);
    });

    return (
        <main>
            <div className="h-screen flex justify-center items-center p-4">
                <div className="flex flex-col md:flex-row items-center justify-around  h-auto w-full max-w-3xl p-6 rounded-lg">
                    <div className="mb-4 md:mb-0">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={400} // Ajuste o tamanho da imagem para telas menores
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
                                type="email"
                                placeholder="Digite o email"
                                {...form.register('email')}
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
        </main>
    );
}
