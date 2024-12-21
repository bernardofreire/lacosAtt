import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Dashboard from "./_components/theme-provider";

export default async function Page() {
    const session = await getServerSession();

    // if (!session) {
    //     redirect("/auth");
    // }

    const userName = session?.user?.name || "Usuário";
    

    return (
        <main>
            <Dashboard userName={userName} />
        </main>
    );
}
