'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { AdminServices } from '@/services/AdminService'
import { ChevronLeft, Save } from 'lucide-react'

export default function EditUserDetails({ params }: { params: { id: string } }) {
    const userId = parseInt(params.id)


    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await AdminServices.getUser(userId); // Função para buscar os dados do usuário
                setUser(response);
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);


    const handleSave = async () => {
        // Validando se as senhas coincidem
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        // Preparando os dados a serem atualizados
        const updatedUser = {
            ...user,
            password: newPassword, // Atualizando a senha
        };

        try {
            // Chama a função para atualizar o usuário no backend
            await AdminServices.updateUser(userId, updatedUser);

            // Sucesso
            alert('Detalhes do usuário atualizados com sucesso!');

            // Redireciona para a lista de usuários após o sucesso
            router.push('/app/usuarios');
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            alert('Ocorreu um erro ao atualizar o usuário. Por favor, tente novamente.');
        }
    };




    if (!user) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="max-w-lg mx-auto mt-8 space-y-6">
            <Card>
                <div className="flex space-x-4 mt-6 ml-6">
                    {/* Botão de Voltar */}
                    <Button variant="outline" onClick={() => router.back()}>  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Button>
                </div>
                <CardHeader>
                    <CardTitle>Atualizar conta de Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Usuário</Label>
                            <Input
                                id="name"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                placeholder="Entre com o ID do usuário"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Senha Atual</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Entre com a senha atual do usuário"
                            />
                        </div>

                        <div>
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Entre com a nova senha do usuário"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova senha"
                            />
                        </div>
                    </div>
                </CardContent>

                <div className="flex space-x-4 ml-6 mb-6">
                    {/* Botão de Save */}
                    <Button onClick={handleSave}> <Save className="mr-2 h-4 w-4" /> Salvar</Button>
                </div>
            </Card>
        </div>
    );
};

