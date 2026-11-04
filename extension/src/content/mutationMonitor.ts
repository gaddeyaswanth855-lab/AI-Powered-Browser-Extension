export class MutationMonitor {
  private observer: MutationObserver | null = null;
  private loadTimestamp: number = Date.now();
  private debounceTimer: any = null;
  private onTriggerCallback: (delayed: boolean) => void;
  private isObserving: boolean = false;

  constructor(onTriggerCallback: (delayed: boolean) => void) {
    this.onTriggerCallback = onTriggerCallback;
  }

  public start(): void {
    if (this.isObserving || typeof window === 'undefined') return;
    this.loadTimestamp = Date.now();

    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      // Retry when body becomes available
      window.addEventListener('DOMContentLoaded', () => this.start(), { once: true });
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      let isRelevantMutation = false;
      const elapsed = Date.now() - this.loadTimestamp;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              const tagName = el.tagName.toLowerCase();

              // Check for late password inputs, forms, or brand logos
              if (
                tagName === 'input' && (el.getAttribute('type') === 'password' || el.getAttribute('name')?.includes('pass')) ||
                tagName === 'form' ||
                tagName === 'iframe' ||
                el.querySelector?.('input[type="password"], form, iframe, img[src*="logo" i], svg[class*="logo" i]')
              ) {
                isRelevantMutation = true;
                break;
              }
            }
          }
        }
        if (isRelevantMutation) break;
      }

      if (isRelevantMutation) {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          const isDelayed = elapsed > 1000;
          this.onTriggerCallback(isDelayed);
        }, 300);
      }
    });

    this.observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
    this.isObserving = true;
  }

  public stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.isObserving = false;
  }
}
