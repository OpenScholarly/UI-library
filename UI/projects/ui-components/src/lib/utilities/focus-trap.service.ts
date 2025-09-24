import { Injectable } from '@angular/core';

/**
 * Service for managing focus trapping within components like modals and dialogs.
 * Provides methods to trap focus within an element and restore focus when done.
 */
@Injectable({
  providedIn: 'root'
})
export class FocusTrapService {
  private focusableElementsSelector = 
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
  
  private lastFocusedElement: HTMLElement | null = null;

  /**
   * Trap focus within the given element
   */
  trapFocus(element: HTMLElement): void {
    // Store the currently focused element
    this.lastFocusedElement = document.activeElement as HTMLElement;
    
    // Get all focusable elements within the trap
    const focusableElements = this.getFocusableElements(element);
    
    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus to the first focusable element
    firstElement.focus();

    // Add keydown listener for Tab navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey) {
        // Shift+Tab: focus previous element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: focus next element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    
    // Store the listener on the element for cleanup
    (element as any)._focusTrapListener = handleKeyDown;
  }

  /**
   * Release focus trap and restore focus to the previously focused element
   */
  releaseFocus(element: HTMLElement): void {
    const listener = (element as any)._focusTrapListener;
    if (listener) {
      element.removeEventListener('keydown', listener);
      delete (element as any)._focusTrapListener;
    }

    // Restore focus to the element that was focused before trapping
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  /**
   * Get all focusable elements within the given container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const elements = Array.from(
      container.querySelectorAll(this.focusableElementsSelector)
    ) as HTMLElement[];

    return elements.filter(element => {
      return !element.hasAttribute('disabled') && 
             !element.getAttribute('aria-hidden') &&
             element.offsetWidth > 0 && 
             element.offsetHeight > 0;
    });
  }

  /**
   * Focus the first focusable element within the container
   */
  focusFirst(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }

  /**
   * Focus the last focusable element within the container
   */
  focusLast(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }
}