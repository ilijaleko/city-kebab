export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="flex justify-center">
        <div className="h-8 w-40 bg-stone-200 dark:bg-stone-800 rounded-lg" />
      </div>

      {/* Nav skeleton */}
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-28 bg-stone-200 dark:bg-stone-800 rounded-full"
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-36 bg-stone-200 dark:bg-stone-800 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5"
          >
            <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded mb-3" />
            <div className="h-3 w-48 bg-stone-100 dark:bg-stone-800 rounded mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-5 w-16 bg-stone-100 dark:bg-stone-800 rounded-md"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
