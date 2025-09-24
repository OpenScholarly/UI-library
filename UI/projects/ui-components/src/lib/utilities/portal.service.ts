import { Injectable, TemplateRef, ViewContainerRef, EmbeddedViewRef, ComponentRef } from '@angular/core';

/**
 * Service for creating portals - teleporting content to different parts of the DOM
 */
@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private portalOutlets = new Map<string, HTMLElement>();
  private activePortals = new Map<string, EmbeddedViewRef<any> | ComponentRef<any>>();

  /**
   * Register a portal outlet (destination) with a given name
   */
  registerOutlet(name: string, element: HTMLElement): void {
    this.portalOutlets.set(name, element);
  }

  /**
   * Unregister a portal outlet
   */
  unregisterOutlet(name: string): void {
    // Clean up any active portals using this outlet
    this.closePortal(name);
    this.portalOutlets.delete(name);
  }

  /**
   * Create a portal from a template
   */
  createTemplatePortal<T = any>(
    templateRef: TemplateRef<T>,
    viewContainerRef: ViewContainerRef,
    outletName: string = 'default',
    context?: T,
    portalId?: string
  ): string {
    const outlet = this.portalOutlets.get(outletName);
    if (!outlet) {
      throw new Error(`Portal outlet '${outletName}' not found. Make sure to register it first.`);
    }

    const id = portalId || this.generatePortalId();
    
    // Close existing portal with same ID
    this.closePortal(id);

    // Create the view
    const viewRef = viewContainerRef.createEmbeddedView(templateRef, context);
    
    // Append nodes to the outlet
    viewRef.rootNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        outlet.appendChild(node);
      }
    });

    // Track the portal
    this.activePortals.set(id, viewRef);

    return id;
  }

  /**
   * Create a portal from a component
   */
  createComponentPortal<T>(
    componentRef: ComponentRef<T>,
    outletName: string = 'default',
    portalId?: string
  ): string {
    const outlet = this.portalOutlets.get(outletName);
    if (!outlet) {
      throw new Error(`Portal outlet '${outletName}' not found. Make sure to register it first.`);
    }

    const id = portalId || this.generatePortalId();
    
    // Close existing portal with same ID
    this.closePortal(id);

    // Append component's host element to outlet
    outlet.appendChild(componentRef.location.nativeElement);

    // Track the portal
    this.activePortals.set(id, componentRef);

    return id;
  }

  /**
   * Close a specific portal by ID
   */
  closePortal(portalId: string): void {
    const portal = this.activePortals.get(portalId);
    if (!portal) {
      return;
    }

    if (portal instanceof EmbeddedViewRef) {
      // Remove nodes from DOM
      portal.rootNodes.forEach(node => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      portal.destroy();
    } else {
      // Component portal
      const element = portal.location.nativeElement;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      portal.destroy();
    }

    this.activePortals.delete(portalId);
  }

  /**
   * Close all portals in a specific outlet
   */
  closePortalsInOutlet(outletName: string): void {
    const outlet = this.portalOutlets.get(outletName);
    if (!outlet) {
      return;
    }

    // Find all portals in this outlet and close them
    const portalsToClose: string[] = [];
    this.activePortals.forEach((portal, id) => {
      let portalElement: HTMLElement;
      
      if (portal instanceof EmbeddedViewRef) {
        portalElement = portal.rootNodes.find(node => node.nodeType === Node.ELEMENT_NODE);
      } else {
        portalElement = portal.location.nativeElement;
      }
      
      if (portalElement && outlet.contains(portalElement)) {
        portalsToClose.push(id);
      }
    });

    portalsToClose.forEach(id => this.closePortal(id));
  }

  /**
   * Close all active portals
   */
  closeAllPortals(): void {
    Array.from(this.activePortals.keys()).forEach(id => this.closePortal(id));
  }

  /**
   * Check if a portal is active
   */
  isPortalActive(portalId: string): boolean {
    return this.activePortals.has(portalId);
  }

  /**
   * Get the default portal outlet element (usually body or a designated container)
   */
  getDefaultOutlet(): HTMLElement {
    let outlet = this.portalOutlets.get('default');
    
    if (!outlet) {
      // Create default outlet if it doesn't exist
      outlet = document.createElement('div');
      outlet.id = 'ui-portal-outlet-default';
      outlet.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: var(--z-index-modal);
      `;
      document.body.appendChild(outlet);
      this.registerOutlet('default', outlet);
    }
    
    return outlet;
  }

  /**
   * Generate a unique portal ID
   */
  private static _portalIdCounter = 0;

  private generatePortalId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `portal-${crypto.randomUUID()}`;
    } else {
      // Fallback: use a counter to ensure uniqueness
      return `portal-fallback-${PortalService._portalIdCounter++}`;
    }
  }

  /**
   * Initialize default outlets
   */
  initializeDefaultOutlets(): void {
    // Create modal outlet
    if (!document.getElementById('ui-portal-outlet-modal')) {
      const modalOutlet = document.createElement('div');
      modalOutlet.id = 'ui-portal-outlet-modal';
      modalOutlet.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: var(--z-index-modal);
      `;
      document.body.appendChild(modalOutlet);
      this.registerOutlet('modal', modalOutlet);
    }

    // Create tooltip outlet
    if (!document.getElementById('ui-portal-outlet-tooltip')) {
      const tooltipOutlet = document.createElement('div');
      tooltipOutlet.id = 'ui-portal-outlet-tooltip';
      tooltipOutlet.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: var(--z-index-tooltip);
      `;
      document.body.appendChild(tooltipOutlet);
      this.registerOutlet('tooltip', tooltipOutlet);
    }

    // Create popover outlet
    if (!document.getElementById('ui-portal-outlet-popover')) {
      const popoverOutlet = document.createElement('div');
      popoverOutlet.id = 'ui-portal-outlet-popover';
      popoverOutlet.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: var(--z-index-popover);
      `;
      document.body.appendChild(popoverOutlet);
      this.registerOutlet('popover', popoverOutlet);
    }
  }
}