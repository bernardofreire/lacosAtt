import PartnersSidebar from "@/components/dashboard/sidebar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="bg-gray-200/20 grid grid-cols-[16rem_1fr] gap-4">
            <aside className="pl-4">
                <PartnersSidebar /> {/*Sidebar */}
            </aside>
            <main className="bg-background shadow-md border border-gray-300 rounded-lg m-4 overflow-hidden h-[calc(100vh-2rem)]">
                {children}
            </main>
        </div>
    );
}
