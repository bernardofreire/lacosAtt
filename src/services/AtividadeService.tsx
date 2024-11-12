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
        // Token para a autenticação
        const token = await AtividadeService.getSessionToken();
        
        const response = await fetch("https://lacos-v2-2.onrender.com/activityList/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, hour_start, hour_end, id_period }),
        });
        return response.json();
    },

    // Buscar a lista de atividades
    getActivityList: async () => {
        // Token para a autenticação
        const token = await AtividadeService.getSessionToken();

        const response = await fetch("https://lacos-v2-2.onrender.com/activityList/get", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Deletar uma atividade da lista
    deleteActivity: async (idActivity: string) => {
        // Token para a autenticação
        const token = await AtividadeService.getSessionToken();

        const response = await fetch(`https://lacos-v2-2.onrender.com/activityList/delete/${idActivity}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Linkar uma atividade a uma pessoa
    linkActivityToPerson: async (id_person: number, id_activity: number) => {
        // Token para a autenticação
        const token = await AtividadeService.getSessionToken();

        const response = await fetch("https://lacos-v2-2.onrender.com/activities/action/link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ id_person, id_activity }),
        });
        return response.json();
    },
};
