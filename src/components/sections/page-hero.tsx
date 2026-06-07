type PageHeroProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#111827]/45 py-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(212,175,55,.12),transparent_32%)]" />
      <div className="relative mx-auto w-[min(1320px,calc(100%_-_40px))]">
        <div className="max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[1.04] text-mstry-silver md:text-7xl">{title}</h1>
          {body ? <p className="mt-6 max-w-3xl text-lg leading-8 text-mstry-muted">{body}</p> : null}
        </div>
      </div>
    </section>
  );
}
