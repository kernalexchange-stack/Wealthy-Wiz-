import React, { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface AdBannerProps {
  /** AdSense Slot ID (optional, from your Google AdSense console) */
  slotId?: string;
  /** Format of the ad: 'auto' | 'rectangle' | 'horizontal' */
  format?: 'auto' | 'rectangle' | 'horizontal';
  /** Optional custom class name */
  className?: string;
  /** Callback to open Privacy / AdSense disclosures */
  onOpenPrivacyPolicy?: () => void;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'auto',
  className = '',
  onOpenPrivacyPolicy,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Attempt to push ad to Google AdSense queue if window.adsbygoogle is loaded and slotId is present
    if (slotId && window.adsbygoogle && !isPushed.current) {
      try {
        window.adsbygoogle.push({});
        isPushed.current = true;
      } catch (e) {
        console.debug('AdSense push deferred or pending script load', e);
      }
    }
  }, [slotId]);

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 ${className}`}>
      <div className="bg-stone-50/80 border border-stone-200/90 rounded-2xl p-3 sm:p-4 text-center relative overflow-hidden transition-all shadow-xs">
        
        {/* AdSense Mandatory Labeling: Clearly marked as Advertisement */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-200/60 mb-3">
          <span>Sponsored Advertisement</span>
          {onOpenPrivacyPolicy && (
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
              title="View Google AdSense & Cookie Privacy Disclosures"
            >
              <Info className="w-3 h-3" />
              <span>Ad Choices</span>
            </button>
          )}
        </div>

        {slotId ? (
          /* Real Google AdSense Tag (When active with a valid Publisher & Slot ID) */
          <ins
            ref={adRef}
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: format === 'horizontal' ? '90px' : '250px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          /* Verified AdSense Responsive Slot Placeholder with Live Link */
          <div className="py-6 sm:py-8 px-4 border border-dashed border-stone-300 rounded-xl bg-white/70 flex flex-col items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Google AdSense Slot Active • Responsive Display Unit
            </div>
            <p className="text-xs text-stone-500 max-w-md leading-relaxed">
              Targeted financial contextual ads from verified AMCs, banks, and brokerages will render here automatically once your AdSense account domain verification completes.
            </p>
            {onOpenPrivacyPolicy && (
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-[11px] text-[#881337] hover:underline font-semibold mt-1"
              >
                Read Google AdSense & DoubleClick Cookie Disclosures →
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
