export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-[3/4] rounded-2xl bg-secondary/50" />
          <div className="space-y-4">
            <div className="h-4 bg-secondary/50 rounded w-24" />
            <div className="h-10 bg-secondary/50 rounded w-3/4" />
            <div className="h-8 bg-secondary/50 rounded w-32" />
            <div className="h-20 bg-secondary/50 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-lg bg-secondary/50" />
              ))}
            </div>
            <div className="h-12 bg-secondary/50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
