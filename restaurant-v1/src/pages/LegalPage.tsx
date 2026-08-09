import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { LEGAL_POLICIES, type LegalPolicyId } from '../data/legalPolicies';

type LegalPageProps = {
  policyId: LegalPolicyId;
};

export function LegalPage({ policyId }: LegalPageProps): JSX.Element {
  const policy = LEGAL_POLICIES[policyId];

  return (
    <div className="min-h-screen bg-background pb-24 pt-12 sm:pb-28 sm:pt-16">
      <article className="container mx-auto max-w-3xl px-4">
        <Link
          to="/"
          className="mb-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          Back home
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Legal</p>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
          {policy.title}
        </h1>
        <div className="mx-auto mt-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <p className="mt-8 font-serif text-base italic leading-relaxed text-muted sm:text-lg">
          {policy.intro}
        </p>

        <div className="menu-booklet mt-10 space-y-8 px-4 py-8 sm:px-8">
          {policy.sections.map((section, index) => (
            <section key={`${policy.id}-section-${index}`}>
              {section.heading ? (
                <h2 className="mb-3 font-display text-lg uppercase tracking-wider text-gold">
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-sm leading-relaxed text-muted sm:text-base">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted sm:text-base">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {policy.closing ? (
            <p className="border-t border-gold/15 pt-6 text-sm font-medium leading-relaxed text-foreground sm:text-base">
              {policy.closing}
            </p>
          ) : null}
        </div>

        <nav className="mt-8 flex flex-wrap gap-4 text-sm">
          {policyId !== 'terms' ? (
            <Link to="/terms" className="text-gold transition hover:text-gold-hover">
              Terms &amp; Conditions
            </Link>
          ) : null}
          {policyId !== 'privacy' ? (
            <Link to="/privacy" className="text-gold transition hover:text-gold-hover">
              Privacy Policy
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
