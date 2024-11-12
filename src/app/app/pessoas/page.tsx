import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PeopleForm from "./_components/people-forms";
import { getServerSession } from "next-auth";


export default async function Pessoas() {
    // Recupera a sessão para obter o token JWT
    const session = await getServerSession(authOptions);

    // Verifica se o token JWT está presente na sessão
    if (!session?.jwt) {
        return <div>Usuário não autenticado</div>;
    }

    // Chamada à API com o token JWT
    const res = await fetch("https://lacos-v2-2.onrender.com/persons/get", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.jwt}`
        },
    });

    const data = await res.json();

    console.log(data)

    return (
        <div className="flex py-6 h-screen">
            <PeopleForm data={data} />
        </div>
    );
}
