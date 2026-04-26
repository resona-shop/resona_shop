export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-secondary/50 rounded w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] rounded-xl bg-secondary/50" />
              <div className="h-4 bg-secondary/50 rounded w-3/4" />
              <div className="h-4 bg-secondary/50 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
