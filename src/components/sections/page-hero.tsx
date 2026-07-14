type PageHeroProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#111827]/45 py-14 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(212,175,55,.12),transparent_32%)]" />
      <div className="relative mx-auto w-[min(1320px,calc(100%_-_24px))] sm:w-[min(1320px,calc(100%_-_40px))]">
        <div className="max-w-5xl">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-mstry-gold sm:text-xs sm:tracking-[0.22em]">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,11vw,3.5rem)] font-black leading-[1.04] text-mstry-silver md:text-7xl">{title}</h1>
          {body ? <p className="mt-5 max-w-3xl text-base leading-7 text-mstry-muted sm:mt-6 sm:text-lg sm:leading-8">{body}</p> : null}
        </div>
      </div>
    </section>
  );
}
