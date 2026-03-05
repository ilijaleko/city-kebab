import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Header showBack backHref="/" />
        {children}
      </div>
    </div>
  );
}
