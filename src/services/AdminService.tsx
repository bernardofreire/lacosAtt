// APIs para usuario Admin
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
    baseURL: "https://lacos-v2.fly.dev",
    headers: {
        "Content-Type": "application/json",
    },
});


export const AdminServices = {

    // Função para obter o token da sessão do usuário para usar nas chamadas das APIs
    getSessionToken: async () => {
        const session = await getSession();
        if (!session?.jwt) {
            throw new Error("Usuário não autenticado");
        }
        return session.jwt;
    },


    // Registrar usuário
    registerUser: async (bodyRegisterUser: { username: string; password: string }) => {
        const token = await AdminServices.getSessionToken();

        const response = await api.post("/register", bodyRegisterUser, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },



    // Deletar usuário
    deleteUser: async (idUser: string) => {
        const token = await AdminServices.getSessionToken();

        const response = await api.delete(`/user/delete/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    },



    // Atualizar usuário
    updateUser: async (idUser: number, updatedUser: unknown) => {
        const token = await AdminServices.getSessionToken();

        const response = await api.patch(`/user/update/${idUser}`, updatedUser, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    },




    // Buscar todos os usuários
    getAllUsers: async (limit: number, offset: number, q?: string) => {
        const query = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
        if (q) query.append("q", q);


        const token = await AdminServices.getSessionToken();

        const response = await api.get(`/user/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data.data, "aq user")

        return response.data.data;
    },



    // Buscar um usuário específico
    getUser: async (idUser: number) => {
        const token = await AdminServices.getSessionToken();

        const response = await api.get(`/user/get/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data.data, "aq user")

        return response.data.data;
    },

};
