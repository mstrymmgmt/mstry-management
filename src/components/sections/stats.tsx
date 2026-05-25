const stats = [
  ["96%", "Administrative workload removed from founders"],
  ["48h", "Initial jurisdiction and operating roadmap"],
  ["32+", "Setup, structuring, and management functions"],
  ["1", "Private operating desk for execution"]
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_40px))] border border-white/10 bg-white/[.03] md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:last:border-r-0" key={label}>
            <strong className="block text-5xl leading-none text-mstry-gold">{value}</strong>
            <span className="mt-3 block font-bold text-mstry-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
