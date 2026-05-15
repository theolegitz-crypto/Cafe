declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

const gaId = import.meta.env.VITE_GA_ID;
const yandexId = import.meta.env.VITE_YANDEX_METRICA_ID;

function appendScript(id: string, src: string, onLoad?: () => void) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;

  if (onLoad) {
    script.addEventListener('load', onLoad, { once: true });
  }

  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (gaId) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
      window.gtag ??
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    appendScript('ga-script', `https://www.googletagmanager.com/gtag/js?id=${gaId}`, () => {
      window.gtag?.('js', new Date());
      window.gtag?.('config', gaId);
    });
  }

  if (yandexId) {
    appendScript('ym-script', 'https://mc.yandex.ru/metrika/tag.js', () => {
      window.ym?.(Number(yandexId), 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    });
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (gaId && window.gtag) {
    window.gtag('event', name, params);
  }

  if (yandexId && window.ym) {
    window.ym(Number(yandexId), 'reachGoal', name, params);
  }
}
