import { getSession } from "next-auth/react";

export const PeopleService = {
  // Função para obter o token da sessão do usuário para usar nas chamadas das APIs
  getSessionToken: async () => {
    const session = await getSession();
    if (!session?.jwt) {
      throw new Error("Usuário não autenticado");
    }
    return session.jwt;
  },

  // Criar uma nova pessoa
  createPerson: async (personData: any) => {
    const token = await PeopleService.getSessionToken();

    const response = await fetch("https://lacos-v2-2.onrender.com/persons/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar pessoa: ${response.statusText}`);
    }

    return response.json();
  },

  // Atualizar uma pessoa existente
  updatePerson: async (personData: any) => {
    const token = await PeopleService.getSessionToken();

    const response = await fetch("https://lacos-v2-2.onrender.com/persons/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar pessoa: ${response.statusText}`);
    }

    return response.json();
  },

  // Buscar uma pessoa pelo ID
  getPersonById: async (idPerson: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await fetch(`https://lacos-v2-2.onrender.com/persons/get/${idPerson}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pessoa: ${response.statusText}`);
    }

    return response.json();
  },

  // Deletar uma pessoa pelo ID
  deletePerson: async (idUser: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await fetch(`https://lacos-v2-2.onrender.com/persons/delete/${idUser}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar pessoa: ${response.statusText}`);
    }

    return response.json();
  },

  // Buscar várias pessoas com filtros
  getAllPersons: async (limit: number, offset: number, q?: string) => {
    const token = await PeopleService.getSessionToken();

    const query = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
    if (q) query.append("q", q);

    const response = await fetch(`https://lacos-v2-2.onrender.com/persons/get?${query}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pessoas: ${response.statusText}`);
    }

    return response.json();
  },

  // Ativar uma pessoa pelo ID
  activatePerson: async (idUser: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await fetch(`https://lacos-v2-2.onrender.com/persons/active/${idUser}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao ativar pessoa: ${response.statusText}`);
    }

    return response.json();
  },
};
