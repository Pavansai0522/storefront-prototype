import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
interface AgeGateProps {
  onVerify: () => void;
}
export function AgeGate({ onVerify }: AgeGateProps) {
  const [isUnderAge, setIsUnderAge] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Small delay to allow for smooth entry animation if needed
    setIsVisible(true);
  }, []);
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-3xl font-display font-bold tracking-wider">
          <Zap className="w-8 h-8 text-gold" fill="currentColor" />
          <span>
            UNITED <span className="text-gold">LIQUORS</span>
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold">
            Welcome to United Liquors
          </h1>
          <p className="text-muted text-lg">
            You must be 21 or older to enter this site
          </p>
        </div>

        {isUnderAge ?
        <div className="p-6 border border-gold/30 bg-card rounded-lg animate-in slide-in-from-bottom-4 duration-300">
            <p className="text-red-400 font-medium">
              We're sorry, but you must be 21 or older to visit our site.
            </p>
          </div> :

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
            onClick={onVerify}
            className="px-8 py-3 bg-gold hover:bg-gold-hover text-background font-bold rounded transition-colors duration-300 min-h-[44px]">
            
              I Am 21+
            </button>
            <button
            onClick={() => setIsUnderAge(true)}
            className="px-8 py-3 border border-gold text-gold hover:bg-gold/10 font-bold rounded transition-colors duration-300 min-h-[44px]">
            
              I Am Under 21
            </button>
          </div>
        }

        <p className="text-xs text-muted/60 pt-8">
          By entering you agree to our Terms. Please drink responsibly.
        </p>
      </div>
    </div>);

}