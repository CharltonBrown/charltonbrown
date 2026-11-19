import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

// So forms can gate their submit button on turnstileToken only when a
// widget is actually going to render — otherwise submit would stay
// permanently disabled while Turnstile is unconfigured (site key unset).
export const isTurnstileConfigured = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
);

interface Props {
  onVerify: (token: string) => void;
}

export interface TurnstileHandle {
  // Discards the current (single-use) token and re-runs the challenge;
  // onVerify fires again once a fresh token is issued.
  reset: () => void;
}

// Renders nothing without NEXT_PUBLIC_TURNSTILE_SITE_KEY (local dev); the
// matching server-side check in lib/turnstile.ts skips verification then too.
const TurnstileWidget = forwardRef<TurnstileHandle, Props>(
  function TurnstileWidget({ onVerify }, ref) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    const renderWidget = useCallback(() => {
      if (
        !siteKey ||
        !containerRef.current ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
      });
    }, [onVerify, siteKey]);

    useEffect(() => {
      if (window.turnstile) {
        renderWidget();
      }
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

    if (!siteKey) return null;

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
        <div ref={containerRef} />
      </>
    );
  },
);

export default TurnstileWidget;
