"use client";

import { AdminServices } from "@/services/AdminService";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id_user: string;
  username: string;
}

interface UserContextType {
  usuarios: User[] | null;
  usuariosLength: number;
  isLoading: boolean;
  setUsuarios: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminServices.getAllUsers(100, 0); // Ajuste o limite e o offset conforme necessário
        console.log(response,"Usuarios aqui")
        setUsuarios(response);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const usuariosLength = usuarios ? usuarios.length : 0;

  return (
    <UserContext.Provider value={{ usuarios, usuariosLength, isLoading, setUsuarios }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
