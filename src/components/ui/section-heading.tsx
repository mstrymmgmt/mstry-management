type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-mstry-gold">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.04] text-mstry-silver md:text-6xl">
          {title}
        </h2>
      </div>
      {body ? <p className="max-w-xl text-mstry-muted">{body}</p> : null}
    </div>
  );
}
