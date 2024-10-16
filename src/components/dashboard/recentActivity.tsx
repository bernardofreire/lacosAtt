import { CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function RecentActivity() {
    return (

        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center  justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                        Atividades Recentes
                    </CardTitle>
                    <CircleDollarSign className="ml-auto w-4 h-4" />
                </div>
                <CardDescription>
                    Atividades de usuários nas últimas 24 horas
                </CardDescription>
            </CardHeader>

            <CardContent>
                <article className="flex items-center gap-2 border-b py-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm sm:text-base font-semibold">Vitor Pinto <span className="pl-2 text-[12px] font-light sm:text-sm text-gray-400">(vitorpinto@teste.com)</span></p>
                        <span className="text-[12px] sm:text-sm text-gray-400">Criou um novo usuário <span className="font-semibold text-gray-600/75">Saullao de Festa</span> </span>
                    </div>
                </article>

                <article className="flex items-center gap-2 border-b py-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm sm:text-base font-semibold">Vitor Pinto <span className="pl-2 text-[12px] font-light sm:text-sm text-gray-400">(vitorpinto@teste.com)</span></p>
                        <span className="text-[12px] sm:text-sm text-gray-400">Criou um novo usuário <span className="font-semibold text-gray-600/75">Saullao de Festa</span> </span>
                    </div>
                </article>
                
                <article className="flex items-center gap-2 border-b py-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm sm:text-base font-semibold">Vitor Pinto <span className="pl-2 text-[12px] font-light sm:text-sm text-gray-400">(vitorpinto@teste.com)</span></p>
                        <span className="text-[12px] sm:text-sm text-gray-400">Criou um novo usuário <span className="font-semibold text-gray-600/75">Saullao de Festa</span> </span>
                    </div>
                </article>
            </CardContent>
        </Card>

    )
}