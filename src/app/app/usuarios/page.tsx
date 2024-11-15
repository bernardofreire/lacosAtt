"use client";

import { useState, ChangeEvent } from "react";
import React from "react";
import { Plus, Search, MoreHorizontal, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/contexts/UserContext";
import { AdminServices } from "@/services/AdminService";

interface User {
    id_user: string;
    username: string;
}

type UserField = {
    name: keyof User | "password";
    label: string;
    type: string;
    required: boolean;
};

const userFields: UserField[] = [
    { name: "username", label: "Nome do Usuário", type: "text", required: true },
    { name: "password", label: "Senha", type: "password", required: true },
];

export default function UsersDashboard() {
    const { usuarios, setUsuarios, isLoading } = useUserContext();

    // ==========================CREATE==============================
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<Partial<User & { password: string }>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const filteredUsers = (usuarios || []).filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));

        const field = userFields.find((field) => field.name === name);
        if (field?.required && value.trim() === "") {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: `${field.label} é obrigatório` }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleAddUser = async () => {
        const requiredFields = userFields.filter((field) => field.required);
        const hasErrors = requiredFields.some((field) => !newUser[field.name]?.toString().trim());

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...Object.fromEntries(requiredFields.map((field) => [field.name, `${field.label} é obrigatório`])),
            }));
            return;
        }

        try {
            const { username, password } = newUser;

            // Chamada para criar o usuário na API
            await AdminServices.registerUser(username as string, password as string);

            // Após a criação, realiza a busca novamente para garantir que a lista de usuários está atualizada
            const usuariosResponse = await AdminServices.getAllUsers(100, 0);
            setUsuarios(usuariosResponse);

            // Limpa o formulário e fecha o diálogo
            setNewUser({});
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            console.log(`Deletar usuário com ID: ${id}`);
            await AdminServices.deleteUser(id.toString());

            // Atualiza a lista de usuários
            const usuariosResponse = await AdminServices.getAllUsers(100, 0);
            setUsuarios(usuariosResponse.data);
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    };

    const renderUserForm = () => (
        <div>
            {userFields.map((field) => (
                <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium">{field.label}</label>
                    <Input
                        type={field.type}
                        name={field.name}
                        value={newUser[field.name as keyof typeof newUser] || ""}
                        onChange={handleInputChange}
                        placeholder={field.label}
                        className={`mt-1 ${errors[field.name] ? "border-red-500" : ""}`}
                    />
                    {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-center">
                        <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                            Gerenciar Usuários
                        </CardTitle>
                        <User className="ml-auto w-4 h-4" />
                    </div>
                    <CardDescription>
                        Adicione e gerencie usuários. Insira nomes e senhas para criar novos acessos ao sistema.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex justify-between items-center mt-10 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Procurar Usuário..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add User</DialogTitle>
                            <DialogDescription>
                                Insira os detalhes do novo usuário aqui.
                            </DialogDescription>
                        </DialogHeader>
                        {renderUserForm()}
                        <DialogFooter>
                            <Button onClick={handleAddUser}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <p>Loading users...</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome do Usuário</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id_user}>
                                <TableCell>{user.id_user}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(user.id_user)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
