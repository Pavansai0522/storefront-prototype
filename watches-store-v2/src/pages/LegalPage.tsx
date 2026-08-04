import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_POLICIES, type LegalPolicyId } from '../data/legalPolicies';

type LegalPageProps = {
  policyId: LegalPolicyId;
};

export function LegalPage({ policyId }: LegalPageProps): JSX.Element {
  const policy = LEGAL_POLICIES[policyId];

  return (
    <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <article className="storefront-shell max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          Legal
        </p>
        <h1 className="mb-6 font-bebas text-4xl font-normal tracking-wide text-black md:text-5xl">
          {policy.title}
        </h1>
        <div className="mb-8 h-1 w-24 rounded-full bg-brand-purple" />

        <p className="mb-8 text-base leading-relaxed text-brand-text md:text-lg">{policy.intro}</p>

        <div className="space-y-8">
          {policy.sections.map((section, index) => (
            <section key={`${policy.id}-section-${index}`}>
              {section.heading ? (
                <h2 className="mb-3 text-lg font-semibold text-brand-text">{section.heading}</h2>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-base leading-relaxed text-brand-text">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-brand-text">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {policy.closing ? (
          <p className="mt-8 text-base font-medium leading-relaxed text-brand-text">
            {policy.closing}
          </p>
        ) : null}

        <p className="mt-12">
          <Link
            to="/"
            className="text-sm font-semibold text-brand-purple transition-colors hover:text-brand-purple-dim"
          >
            ← Back to Home
          </Link>
        </p>
      </article>
    </div>
  );
}
