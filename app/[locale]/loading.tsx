export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400 dark:border-stone-500 mx-auto mb-4" />
        <p className="text-stone-500 dark:text-stone-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
