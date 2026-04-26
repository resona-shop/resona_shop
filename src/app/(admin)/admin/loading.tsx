export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-secondary/50 rounded w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-secondary/50 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-secondary/50 rounded-xl" />
    </div>
  );
}
