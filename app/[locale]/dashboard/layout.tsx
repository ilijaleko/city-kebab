import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Header showBack backHref="/" />
        {children}
      </div>
    </div>
  );
}
