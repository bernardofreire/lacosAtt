import axios from "axios";
import { getSession } from "next-auth/react";

// Configuração inicial do Axios
const api = axios.create({
  baseURL: "https://lacos-v2.fly.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

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

    const response = await api.post("/persons/create", personData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },





  // Atualizar uma pessoa existente
  updatePerson: async (personData: any) => {
    const token = await PeopleService.getSessionToken();

    const response = await api.patch("/persons/update", personData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },




  // Buscar uma pessoa pelo ID
  getPersonById: async (idPerson: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await api.get(`/persons/get/${idPerson}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },



  // Deletar uma pessoa pelo ID
  deletePerson: async (idUser: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await api.delete(`/persons/delete/${idUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },




  // Buscar várias pessoas com filtros
  getAllPersons: async (limit: number, offset: number, q?: string) => {
    const token = await PeopleService.getSessionToken();

    const params: Record<string, string> = { limit: limit.toString(), offset: offset.toString() };
    if (q) params.q = q;

    const response = await api.get("/persons/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  },


  

  // Ativar uma pessoa pelo ID
  activatePerson: async (idUser: number) => {
    const token = await PeopleService.getSessionToken();

    const response = await api.post(`/persons/active/${idUser}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
