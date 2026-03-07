"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-4xl">🥙</div>
        <h2 className="font-playfair text-xl font-bold text-stone-900 dark:text-stone-50">
          Something went wrong
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white px-5 py-2 rounded-xl text-sm font-medium cursor-pointer shadow-md"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
