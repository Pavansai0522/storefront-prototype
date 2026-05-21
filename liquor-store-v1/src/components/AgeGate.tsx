import React, { useEffect, useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { StoreBrandLogo } from './StoreBrandLogo';

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps): JSX.Element | null {
  const { clientConfig } = useStoreData();
  const [isUnderAge, setIsUnderAge] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background p-4 animate-in fade-in duration-500"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="my-auto w-full max-w-md space-y-6 py-4 text-center sm:max-w-lg sm:space-y-8">
        <div className="flex justify-center px-2">
          <StoreBrandLogo
            iconClassName="h-7 w-7 text-gold sm:h-8 sm:w-8"
            textClassName="text-2xl font-display font-bold tracking-wide sm:text-3xl sm:tracking-wider"
          />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            Welcome to {clientConfig.storeName}
          </h1>
          <p className="text-base text-muted sm:text-lg">
            You must be 21 or older to enter this site
          </p>
        </div>

        {isUnderAge ? (
          <div className="animate-in slide-in-from-bottom-4 rounded-lg border border-gold/30 bg-card p-5 duration-300 sm:p-6">
            <p className="font-medium text-red-400">
              We&apos;re sorry, but you must be 21 or older to visit our site.
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row sm:items-stretch sm:gap-4 sm:pt-4">
            <button
              type="button"
              onClick={onVerify}
              className="min-h-[44px] w-full touch-manipulation rounded bg-gold px-8 py-3 text-base font-bold text-background transition-colors duration-300 hover:bg-gold-hover sm:flex-1"
            >
              I Am 21+
            </button>
            <button
              type="button"
              onClick={() => setIsUnderAge(true)}
              className="min-h-[44px] w-full touch-manipulation rounded border border-gold px-8 py-3 text-base font-bold text-gold transition-colors duration-300 hover:bg-gold/10 sm:flex-1"
            >
              I Am Under 21
            </button>
          </div>
        )}

        <p className="px-2 pt-4 text-xs text-muted/60 sm:pt-8">
          By entering you agree to our Terms. Please drink responsibly.
        </p>
      </div>
    </div>
  );
}
