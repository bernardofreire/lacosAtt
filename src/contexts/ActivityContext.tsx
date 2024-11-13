"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AtividadeService } from '@/services/AtividadeService';

interface Activity {
    id_activity: number;
    name: string;
    hour_start: string;
    hour_end: string;
    id_period: number;
}

interface ActivityContextType {
    atividades: Activity[] | null;
    isLoading: boolean;
    setAtividades: React.Dispatch<React.SetStateAction<Activity[] | null>>; 
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [atividades, setAtividades] = useState<Activity[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const atividadesResponse = await AtividadeService.getActivityList();
                console.log(atividadesResponse.data.length, "Atividades carregadas");

                setAtividades(atividadesResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("Atividades foram atualizadas:", atividades);
    }, [atividades]);

    return (
        <ActivityContext.Provider value={{ atividades, isLoading, setAtividades }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivityContext = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error("useActivityContext must be used within an ActivityProvider");
    }
    return context;
};
