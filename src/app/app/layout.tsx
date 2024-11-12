import PartnersSidebar from "@/app/app/_components/sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {

    const session = await getServerSession();

    if (!session) {
        redirect("/auth");
    }

    const userName = session?.user?.name || "Usuário";
    const userEmail = session?.user?.email || "email@example.com";
    
    return (
        <div className="bg-gray-200/20 grid grid-cols-[16rem_1fr] gap-4">
            <aside className="pl-4">
                <PartnersSidebar userName={userName} userEmail={userEmail}/> {/*Sidebar */}
            </aside>
            <main className="bg-background shadow-md border border-gray-300 rounded-lg my-4 ml-4 overflow-hidden h-[calc(100vh-2rem)]">
                {children}
            </main>
        </div>
    );
}
