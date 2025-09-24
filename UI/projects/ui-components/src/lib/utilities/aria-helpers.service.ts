import { Injectable } from '@angular/core';

/**
 * Service providing utilities for ARIA attributes and accessibility helpers
 */
@Injectable({
  providedIn: 'root'
})
export class AriaHelpersService {

  /**
   * Generate a unique ID for ARIA relationships
   */
  generateId(prefix: string = 'ui'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set ARIA attributes on an element
   */
  setAriaAttributes(element: HTMLElement, attributes: Record<string, string | boolean | null>): void {
    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
      
      if (value === null || value === false) {
        element.removeAttribute(ariaKey);
      } else {
        element.setAttribute(ariaKey, value.toString());
      }
    });
  }

  /**
   * Announce text to screen readers using an aria-live region
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcer = this.getOrCreateAnnouncer(priority);
    
    // Clear the announcer first, then set the message
    // This ensures screen readers pick up repeated messages
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  /**
   * Create live region announcer for screen reader announcements
   */
  private getOrCreateAnnouncer(priority: 'polite' | 'assertive'): HTMLElement {
    const id = `ui-live-announcer-${priority}`;
    let announcer = document.getElementById(id);
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = id;
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      `;
      document.body.appendChild(announcer);
    }
    
    return announcer;
  }

  /**
   * Set expanded state and update aria-expanded
   */
  setExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  /**
   * Set pressed state and update aria-pressed  
   */
  setPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString());
  }

  /**
   * Set selected state and update aria-selected
   */
  setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  /**
   * Set checked state and update aria-checked
   */
  setChecked(element: HTMLElement, checked: boolean | 'mixed'): void {
    element.setAttribute('aria-checked', checked.toString());
  }

  /**
   * Set disabled state and update aria-disabled
   */
  setDisabled(element: HTMLElement, disabled: boolean): void {
    if (disabled) {
      element.setAttribute('aria-disabled', 'true');
      element.setAttribute('tabindex', '-1');
    } else {
      element.removeAttribute('aria-disabled');
      element.removeAttribute('tabindex');
    }
  }

  /**
   * Associate elements using aria-describedby
   */
  associateWithDescription(element: HTMLElement, descriptionId: string): void {
    const existing = element.getAttribute('aria-describedby');
    const ids = existing ? existing.split(' ') : [];
    
    if (!ids.includes(descriptionId)) {
      ids.push(descriptionId);
      element.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  /**
   * Associate elements using aria-labelledby
   */
  associateWithLabel(element: HTMLElement, labelId: string): void {
    const existing = element.getAttribute('aria-labelledby');
    const ids = existing ? existing.split(' ') : [];
    
    if (!ids.includes(labelId)) {
      ids.push(labelId);
      element.setAttribute('aria-labelledby', ids.join(' '));
    }
  }

  /**
   * Remove association by ID
   */
  removeAssociation(element: HTMLElement, attribute: 'aria-describedby' | 'aria-labelledby', idToRemove: string): void {
    const existing = element.getAttribute(attribute);
    if (!existing) return;
    
    const ids = existing.split(' ').filter(id => id !== idToRemove);
    
    if (ids.length === 0) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, ids.join(' '));
    }
  }

  /**
   * Set role attribute
   */
  setRole(element: HTMLElement, role: string | null): void {
    if (role === null) {
      element.removeAttribute('role');
    } else {
      element.setAttribute('role', role);
    }
  }

  /**
   * Check if element is focusable
   */
  isFocusable(element: HTMLElement): boolean {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return focusableSelectors.some(selector => element.matches(selector)) &&
           !element.hasAttribute('aria-hidden') &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
  }

  /**
   * Set aria-invalid and optionally associate with error message
   */
  setInvalid(element: HTMLElement, invalid: boolean, errorId?: string): void {
    element.setAttribute('aria-invalid', invalid.toString());
    
    if (invalid && errorId) {
      this.associateWithDescription(element, errorId);
    } else if (!invalid && errorId) {
      this.removeAssociation(element, 'aria-describedby', errorId);
    }
  }
}