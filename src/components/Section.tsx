/** Small uppercase label + title + optional subtitle, used at the top of each section. */
export function SectionHeading({
  label,
  title,
  subtitle,
  center = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {label && <p className="text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">{label}</p>}
      <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}
