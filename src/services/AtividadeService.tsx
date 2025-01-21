import axios from "axios";
import { getSession } from "next-auth/react";

export const AtividadeService = {
    // Função para obter o token da sessão do usuário para usar nas chamadas das APIs
    getSessionToken: async () => {
        const session = await getSession();
        if (!session?.jwt) {
            throw new Error("Usuário não autenticado");
        }
        return session.jwt;
    },

    // Criar uma atividade
    createActivity: async (name: string, hour_start: string, hour_end: string, id_period: number) => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.post(
            "https://lacos-v2.fly.dev/activityList/create",
            { name, hour_start, hour_end, id_period },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },

    // Buscar a lista de atividades
    getActivityList: async () => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.get("https://lacos-v2.fly.dev/activityList/get", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Deletar uma atividade da lista
    deleteActivity: async (idActivity: number) => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.delete(`https://lacos-v2.fly.dev/activityList/delete/${idActivity}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Linkar uma atividade a uma pessoa
    linkActivityToPerson: async (id_person: number, id_activity: number) => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.post(
            "https://lacos-v2.fly.dev/activities/action/link",
            { id_person, id_activity },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    // Remover o link de uma atividade de uma pessoa
    removeLinkActivityOfPerson: async (id_activity: number) => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.post(
            `https://lacos-v2.fly.dev/activities/action/link/delete/${id_activity}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
        );
        return response.data;
    },


    // Buscar todas as atividades de uma pessoa
    getAllActivityLinksOfPerson: async (id_person: number) => {
        const token = await AtividadeService.getSessionToken();

        const response = await axios.post(
            `https://lacos-v2.fly.dev/activities/getAll/${id_person}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },
};
