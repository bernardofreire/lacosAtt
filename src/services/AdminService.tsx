// APIs para usuario Admin

export const AdminServices = {

    // Registrar usuário
    registerUser: async (username: string, password: string) => {
        const response = await fetch("https://lacos-v2.fly.dev/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },



    // Deletar usuário
    deleteUser: async (idUser: string) => {
        const response = await fetch(`https://lacos-v2.fly.dev/user/delete/${idUser}`, {
            method: "DELETE",
        });
        return response.json();
    },



    // Atualizar usuário
    updateUser: async (idUser: string, username: string, password: string) => {
        const response = await fetch(`https://lacos-v2.fly.dev/user/update/${idUser}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },



    // Buscar todos os usuários
    getAllUsers: async (limit: number, offset: number, q?: string) => {
        const query = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
        if (q) query.append("q", q);
        const response = await fetch(`https://lacos-v2.fly.dev/user/get/?${query}`);
        return response.json();
    },



    // Buscar um usuário específico
    getUser: async (idUser: string) => {
        const response = await fetch(`https://lacos-v2.fly.dev/user/get/${idUser}`);
        return response.json();
    },

};
