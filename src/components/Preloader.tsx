import { useEffect, useRef } from 'react';
import { ClientOnly } from './ClientOnly';
import { ParticlePreloader } from './ParticlePreloader';

const REVIEW_MODE = true;

const PRELOADER_LAST_SEEN_KEY = 'rcs-preloader-last-seen';
const PRELOADER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const FADE_DUR_MS = 400;
const FAILSAFE_MS = 12_000;

function shouldShow(): boolean {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const rawPath = window.location.pathname;
  const pathname = base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;
  if (pathname !== '/' && pathname !== '') return false;
  if (REVIEW_MODE) return true;
  try {
    const lastSeen = Number(window.localStorage.getItem(PRELOADER_LAST_SEEN_KEY) ?? 0);
    if (lastSeen && Date.now() - lastSeen <= PRELOADER_COOLDOWN_MS) return false;
  } catch {
    // localStorage blocked
  }
  return true;
}

const PreloaderOverlay: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = `opacity ${FADE_DUR_MS}ms ease`;
    el.style.opacity = '0';
    setTimeout(() => el.remove(), FADE_DUR_MS + 50);
  };

  useEffect(() => {
    if (!shouldShow()) {
      overlayRef.current?.remove();
      return;
    }
    if (!REVIEW_MODE) {
      try {
        window.localStorage.setItem(PRELOADER_LAST_SEEN_KEY, String(Date.now()));
      } catch { /* ignore */ }
    }
    const failsafe = window.setTimeout(dismiss, FAILSAFE_MS);
    return () => clearTimeout(failsafe);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: '#0B0F2A', opacity: 1 }}
    >
      <ParticlePreloader onComplete={dismiss} />
    </div>
  );
};

export const Preloader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <ClientOnly>
      <PreloaderOverlay />
    </ClientOnly>
  </>
);

export default Preloader;
