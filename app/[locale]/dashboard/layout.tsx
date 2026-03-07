import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container mx-auto max-w-md sm:max-w-lg lg:max-w-3xl px-4 sm:px-5 py-4 sm:py-6">
        <Header showBack backHref="/" />
        {children}
      </div>
    </div>
  );
}
