import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { SchoolHeader } from "@/components/Header/page";
import { SchoolSidebar } from "@/components/Sidebar/page";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      <SchoolSidebar />
      <div className="flex flex-col w-full">
        <SchoolHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
