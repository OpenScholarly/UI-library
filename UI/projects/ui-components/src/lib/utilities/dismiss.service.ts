import { Injectable } from '@angular/core';

export interface DismissOptions {
  /** Whether to handle click outside */
  clickOutside?: boolean;
  /** Whether to handle escape key */
  escapeKey?: boolean;
  /** Elements that should not trigger dismiss when clicked */
  ignoreElements?: HTMLElement[];
  /** Custom condition to check before dismissing */
  shouldDismiss?: (event: Event) => boolean;
}

/**
 * Service for handling dismissal behavior (click outside, escape key, etc.)
 */
@Injectable({
  providedIn: 'root'
})
export class DismissService {
  private dismissHandlers = new Map<string, {
    element: HTMLElement;
    callback: () => void;
    options: DismissOptions;
    listeners: Array<{ element: EventTarget; type: string; listener: EventListener }>;
  }>();

  /**
   * Register dismiss behavior for an element
   */
  register(
    id: string,
    element: HTMLElement,
    callback: () => void,
    options: DismissOptions = {}
  ): void {
    // Remove existing handler if present
    this.unregister(id);

    const defaultOptions: DismissOptions = {
      clickOutside: true,
      escapeKey: true,
      ignoreElements: [],
      ...options
    };

    const listeners: Array<{ element: EventTarget; type: string; listener: EventListener }> = [];

    // Handle click outside
    if (defaultOptions.clickOutside) {
      const clickListener: EventListener = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const target = mouseEvent.target as HTMLElement;
        
        // Check if click is outside the element
        if (!element.contains(target)) {
          // Check ignore elements
          const shouldIgnore = defaultOptions.ignoreElements?.some(ignoreEl => 
            ignoreEl.contains(target)
          );
          
          if (!shouldIgnore) {
            // Check custom condition
            if (!defaultOptions.shouldDismiss || defaultOptions.shouldDismiss(event)) {
              callback();
            }
          }
        }
      };

      document.addEventListener('mousedown', clickListener);
      listeners.push({ element: document, type: 'mousedown', listener: clickListener });
    }

    // Handle escape key
    if (defaultOptions.escapeKey) {
      const keyListener: EventListener = (event: Event) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          // Check custom condition
          if (!defaultOptions.shouldDismiss || defaultOptions.shouldDismiss(event)) {
            event.preventDefault();
            callback();
          }
        }
      };

      document.addEventListener('keydown', keyListener);
      listeners.push({ element: document, type: 'keydown', listener: keyListener });
    }

    // Store the handler
    this.dismissHandlers.set(id, {
      element,
      callback,
      options: defaultOptions,
      listeners
    });
  }

  /**
   * Unregister dismiss behavior
   */
  unregister(id: string): void {
    const handler = this.dismissHandlers.get(id);
    if (!handler) {
      return;
    }

    // Remove all event listeners
    handler.listeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });

    this.dismissHandlers.delete(id);
  }

  /**
   * Update ignore elements for an existing handler
   */
  updateIgnoreElements(id: string, ignoreElements: HTMLElement[]): void {
    const handler = this.dismissHandlers.get(id);
    if (handler) {
      handler.options.ignoreElements = ignoreElements;
    }
  }

  /**
   * Check if a handler is registered
   */
  isRegistered(id: string): boolean {
    return this.dismissHandlers.has(id);
  }

  /**
   * Temporarily disable a handler
   */
  disable(id: string): void {
    const handler = this.dismissHandlers.get(id);
    if (!handler) {
      return;
    }

    // Remove listeners but keep the handler registered
    handler.listeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });
    handler.listeners = [];
  }

  /**
   * Re-enable a disabled handler
   */
  enable(id: string): void {
    const handler = this.dismissHandlers.get(id);
    if (!handler) {
      return;
    }

    // If already enabled, do nothing
    if (handler.listeners.length > 0) {
      return;
    }

    // Re-create listeners
    const listeners: Array<{ element: EventTarget; type: string; listener: EventListener }> = [];

    if (handler.options.clickOutside) {
      const clickListener: EventListener = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const target = mouseEvent.target as HTMLElement;
        
        if (!handler.element.contains(target)) {
          const shouldIgnore = handler.options.ignoreElements?.some(ignoreEl => 
            ignoreEl.contains(target)
          );
          
          if (!shouldIgnore) {
            if (!handler.options.shouldDismiss || handler.options.shouldDismiss(event)) {
              handler.callback();
            }
          }
        }
      };

      document.addEventListener('mousedown', clickListener);
      listeners.push({ element: document, type: 'mousedown', listener: clickListener });
    }

    if (handler.options.escapeKey) {
      const keyListener: EventListener = (event: Event) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          if (!handler.options.shouldDismiss || handler.options.shouldDismiss(event)) {
            event.preventDefault();
            handler.callback();
          }
        }
      };

      document.addEventListener('keydown', keyListener);
      listeners.push({ element: document, type: 'keydown', listener: keyListener });
    }

    handler.listeners = listeners;
  }

  /**
   * Clear all registered handlers
   */
  clear(): void {
    Array.from(this.dismissHandlers.keys()).forEach(id => {
      this.unregister(id);
    });
  }

  /**
   * Get the number of active handlers
   */
  getActiveHandlerCount(): number {
    return this.dismissHandlers.size;
  }
}