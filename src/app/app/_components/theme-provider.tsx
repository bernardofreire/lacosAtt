"use client"

import Chart from "@/components/dashboard/chart";
import RecentActivity from "@/components/dashboard/recentActivity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { usePeopleContext } from "@/contexts/PeopleContext";
import { useUserContext } from "@/contexts/UserContext";
import { Activity, MonitorCheck, Users } from "lucide-react";


export default function Dashboard({ userName }: { userName: string }) {
    const { atividadesLength, isLoading: isAtividadesLoading } = useDataContext();
    const { peopleLength, activePeopleCount, isLoading: isPeopleLoading } = usePeopleContext();
    const { usuariosLength, isLoading: isUsuariosLoading } = useUserContext();

    return (
        <main className="sm:ml-14 p-4">
            <h1 className="text-[12px] py-6 sm:text-sm text-gray-600">Seja Bem vindo, <span className="font-semibold">{userName}</span> </h1>

            <section className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center  justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Total de Pessoas
                            </CardTitle>
                            <Users className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de pessoas em 90 dias
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className="text-base sm:text-lg font-bold">
                            {isPeopleLoading ? "Carregando..." : peopleLength}
                        </p>
                    </CardContent>

                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center  justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Total de Atividades
                            </CardTitle>
                            <Activity className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de atividades registradas em 90 dias
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className="text-base sm:text-lg font-bold">
                            {isAtividadesLoading ? "Carregando..." : atividadesLength}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center  justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Total de Usuários
                            </CardTitle>
                            <Activity className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de usuários registrados em 90 dias
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className="text-base sm:text-lg font-bold">
                            {isUsuariosLoading ? "Carregando..." : usuariosLength}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center  justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Pessoas ativas
                            </CardTitle>
                            <MonitorCheck className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de pessoas ativas
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className="text-base sm:text-lg font-bold">
                            {isPeopleLoading ? "Carregando..." : activePeopleCount}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section className="mt-4 flex flex-col md:flex-row gap-4">
                <Chart />
                <RecentActivity />
            </section>
        </main>)
}