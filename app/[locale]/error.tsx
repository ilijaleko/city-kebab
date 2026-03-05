"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-stone-950 dark:to-stone-900 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-4xl">🥙</div>
        <h2 className="font-playfair text-xl font-bold text-stone-900 dark:text-amber-50">
          Something went wrong
        </h2>
        <p className="text-sm text-stone-500 dark:text-amber-300/50">{error.message}</p>
        <button
          onClick={reset}
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-5 py-2 rounded-xl text-sm font-medium cursor-pointer shadow-md"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
