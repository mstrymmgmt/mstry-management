type PageHeroProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-br from-mstry-gold/10 to-transparent py-20">
      <div className="mx-auto w-[min(1160px,calc(100%_-_40px))]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-5xl font-display text-5xl leading-[1.04] text-mstry-silver md:text-7xl">{title}</h1>
        {body ? <p className="mt-6 max-w-3xl text-lg leading-8 text-mstry-muted">{body}</p> : null}
      </div>
    </section>
  );
}
