"use client";

import { AtividadeService } from "@/services/AtividadeService";
import { useEffect, useState } from "react";

interface Atividade {
    id_activity: number;
    name: string;
    hour_start: string;
    hour_end: string;
    id_period: number;
}

export default function AtividadesPage() {
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AtividadeService.getActivityList();
                console.log("Atividades (raw):", response);

                if (Array.isArray(response.data)) {
                    setAtividades(response.data);
                } else {
                    setError("Os dados retornados não são uma lista de atividades");
                }
            } catch (err) {
                setError("Erro ao carregar as atividades");
                console.error("Erro ao buscar atividades:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Lista de Atividades</h1>
            {error && <p>{error}</p>}
            {atividades.length > 0 ? (
                <ul>
                    {atividades.map((atividade: Atividade) => (
                        <li key={atividade.id_activity}>{atividade.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
