import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">QR Registration</h1>
        </div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/events"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Events
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
