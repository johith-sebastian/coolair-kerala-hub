import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute -left-24 top-10 size-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -right-16 bottom-0 size-80 rounded-full bg-primary/40 blur-3xl" />
      <div className="container-x relative py-16 md:py-24">
        <div className="max-w-3xl animate-rise">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-primary-foreground md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
