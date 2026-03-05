"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
