export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-stone-950 dark:to-stone-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 dark:border-orange-500 mx-auto mb-4" />
        <p className="text-stone-500 dark:text-amber-300/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}
