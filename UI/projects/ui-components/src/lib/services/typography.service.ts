import { Injectable, Signal, WritableSignal, signal, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TypographyService {
  private readonly fontsLoadedSig: WritableSignal<boolean> = signal(false);

  // Readonly signal for components
  readonly fontsLoaded: Signal<boolean> = this.fontsLoadedSig.asReadonly();

  // Observable interop for consumers that prefer RxJS
  get fontsLoaded$() {
    return toObservable(this.fontsLoaded);
  }

  /**
   * Loads critical fonts using the Font Loading API.
   * Uses safe-guards for non-browser/SSR environments.
   * Returns a promise that resolves once fonts are loaded (or when unsupported).
   */
  async loadFonts(fontDescriptors: string[] = [
    'normal 400 16px Inter',
    'normal 700 16px Inter',
    'normal 400 24px "Playfair Display"'
  ]): Promise<void> {
    if (this.fontsLoadedSig()) return; // already loaded

    // Guard for environments without document or Font Loading API
    if (typeof document === 'undefined' || !('fonts' in document)) {
      this.fontsLoadedSig.set(true);
      return;
    }

    try {
      await Promise.all(fontDescriptors.map(desc => (document as any).fonts.load(desc)));
      this.fontsLoadedSig.set(true);

      // Optional: mark DOM for CSS hooks if needed
      document.documentElement.classList.add('fonts-loaded');
      document.documentElement.setAttribute('data-fonts', 'loaded');
    } catch (error) {
      // Fail gracefully: keep swap fallback and continue
      console.warn('Font loading failed:', error);
      this.fontsLoadedSig.set(true);
    }
  }

  /** Promise that resolves when fonts are reported as loaded. */
  whenLoaded(): Promise<void> {
    if (this.fontsLoadedSig()) return Promise.resolve();
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.fontsLoadedSig()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
}
