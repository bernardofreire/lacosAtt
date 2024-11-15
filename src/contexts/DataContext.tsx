"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AtividadeService } from '@/services/AtividadeService';
// import { UserService } from '@/services/UserService'; 

interface Activity {
    id_activity: number;
    name: string;
    hour_start: string;
    hour_end: string;
    id_period: number;
}

interface DataContextType {
    atividades: Activity[] | null;
    atividadesLength: number;
    isLoading: boolean;
    setAtividades: React.Dispatch<React.SetStateAction<Activity[] | null>>; // Adicionado setAtividades
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [atividades, setAtividades] = useState<Activity[] | null>(null);

    
    // const [usuarios, setUsuarios] = useState<User[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [atividadesResponse] = await Promise.all([
                    AtividadeService.getActivityList(),
                ]);
                console.log(atividadesResponse.data.length, "ulaaaa")

                setAtividades(atividadesResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const atividadesLength = atividades ? atividades.length : 0;

    useEffect(() => {
        console.log("Atividades foram atualizadas:", atividades);
      }, [atividades]);

    console.log(atividades, "aqui atividades")

    return (
        <DataContext.Provider value={{ atividades, atividadesLength,  isLoading, setAtividades }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};
