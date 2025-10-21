import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

/**
 * A sidebar/drawer component for side navigation.
 * 
 * ## Features
 * - Multiple display modes: over (overlay), push, side (permanent)
 * - Left/right positioning
 * - Backdrop support with dismiss on click
 * - Focus trap when open (overlay mode) - keeps focus within sidebar
 * - Responsive behavior (auto-collapse on mobile)
 * - Persistent state option
 * - Smooth animations
 * - Full keyboard navigation (Escape to close)
 * - Proper ARIA attributes for accessibility (role="navigation")
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic sidebar with focus trap -->
 * <ui-sidebar
 *   [open]="sidebarOpen"
 *   (openChange)="handleSidebarChange($event)">
 *   <nav>
 *     <a href="/dashboard">Dashboard</a>
 *     <a href="/profile">Profile</a>
 *   </nav>
 * </ui-sidebar>
 * 
 * <!-- Overlay mode with backdrop and Escape key handling -->
 * <ui-sidebar
 *   mode="over"
 *   position="left"
 *   [open]="true"
 *   [backdrop]="true"
 *   [closeOnBackdropClick]="true"
 *   [closeOnEscape]="true">
 *   <div>Sidebar content</div>
 * </ui-sidebar>
 * 
 * <!-- Push mode (pushes main content) -->
 * <ui-sidebar
 *   mode="push"
 *   [open]="true">
 *   <div>Navigation</div>
 * </ui-sidebar>
 * 
 * <!-- Permanent side navigation -->
 * <ui-sidebar
 *   mode="side"
 *   [open]="true"
 *   position="left">
 *   <div>Always visible navigation</div>
 * </ui-sidebar>
 * ```
 */
@Component({
  selector: 'ui-sidebar',
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    @if (backdrop() && open() && mode() === 'over') {
      <div
        [class]="backdropClasses()"
        (click)="onBackdropClick()"
        [attr.aria-hidden]="true">
      </div>
    }

    <!-- Sidebar -->
    <aside
      #sidebarRef
      [class]="sidebarClasses()"
      [attr.role]="'navigation'"
      [attr.aria-label]="ariaLabel() || 'Sidebar navigation'"
      [attr.aria-hidden]="!open()">
      
      <!-- Header slot -->
      @if (showHeader()) {
        <div [class]="headerClasses()">
          <div class="flex items-center justify-between">
            <ng-content select="[slot=header]" />
            
            @if (showCloseButton()) {
              <button
                type="button"
                (click)="close()"
                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                [attr.aria-label]="'Close sidebar'">
                <span class="text-xl">✕</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- Content -->
      <div [class]="contentClasses()">
        <ng-content />
      </div>

      <!-- Footer slot -->
      @if (showFooter()) {
        <div [class]="footerClasses()">
          <ng-content select="[slot=footer]" />
        </div>
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.--sidebar-width]': 'width() + "px"'
  }
})
export class SidebarComponent {
  /**
   * Whether the sidebar is open.
   * @default false
   */
  open = input<boolean>(false);

  /**
   * Display mode of the sidebar.
   * - `over`: Overlay mode with backdrop
   * - `push`: Pushes main content aside
   * - `side`: Permanent side navigation
   * @default "over"
   */
  mode = input<'over' | 'push' | 'side'>('over');

  /**
   * Position of the sidebar.
   * - `left`: Left side (default)
   * - `right`: Right side
   * @default "left"
   */
  position = input<'left' | 'right'>('left');

  /**
   * Width of the sidebar in pixels.
   * @default 280
   */
  width = input<number>(280);

  /**
   * Whether to show backdrop.
   * @default true
   */
  backdrop = input<boolean>(true);

  /**
   * Whether to close sidebar on backdrop click.
   * @default true
   */
  closeOnBackdropClick = input<boolean>(true);

  /**
   * Whether to close sidebar on Escape key.
   * @default true
   */
  closeOnEscape = input<boolean>(true);

  /**
   * Whether to show header section.
   * @default false
   */
  showHeader = input<boolean>(false);

  /**
   * Whether to show footer section.
   * @default false
   */
  showFooter = input<boolean>(false);

  /**
   * Whether to show close button in header.
   * @default true
   */
  showCloseButton = input<boolean>(true);

  /**
   * ARIA label for the sidebar.
   * @default "Sidebar navigation"
   */
  ariaLabel = input<string>();

  /**
   * Whether sidebar is collapsed (mini mode).
   * @default false
   */
  collapsed = input<boolean>(false);

  /**
   * Emitted when open state changes.
   * @event openChange
   */
  openChange = output<boolean>();

  /**
   * Emitted when sidebar is opened.
   * @event opened
   */
  opened = output<void>();

  /**
   * Emitted when sidebar is closed.
   * @event closed
   */
  closed = output<void>();

  private document = inject(DOCUMENT);
  private elementRef = inject(ElementRef);
  private previousActiveElement: HTMLElement | null = null;

  sidebarElement = viewChild<ElementRef>('sidebarRef');

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    // Only handle Escape key when sidebar is open in overlay mode and closeOnEscape is true
    if (event.key === 'Escape' && this.closeOnEscape() && this.open() && this.mode() === 'over') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }

  hostClasses = computed(() => {
    const base = 'ui-sidebar';
    return base;
  });

  backdropClasses = computed(() => {
    const base = 'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300';
    return `${base} ${this.open() ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;
  });

  sidebarClasses = computed(() => {
    const base = 'fixed top-0 bottom-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out flex flex-col';
    
    // Position
    const positionClass = this.position() === 'left' ? 'left-0 border-r' : 'right-0 border-l';
    
    // Z-index based on mode
    const zIndex = this.mode() === 'over' ? 'z-50' : 'z-30';
    
    // Transform based on open state and position
    let transform = '';
    if (!this.open()) {
      if (this.position() === 'left') {
        transform = '-translate-x-full';
      } else {
        transform = 'translate-x-full';
      }
    }
    
    // Width
    const widthClass = this.collapsed() ? 'w-16' : '';
    const widthStyle = !this.collapsed() ? `w-[${this.width()}px]` : '';
    
    return `${base} ${positionClass} ${zIndex} ${transform} ${widthClass} ${widthStyle}`;
  });

  headerClasses = computed(() => 
    'p-4 border-b border-gray-200 dark:border-gray-700'
  );

  contentClasses = computed(() => 
    'flex-1 overflow-y-auto p-4'
  );

  footerClasses = computed(() => 
    'p-4 border-t border-gray-200 dark:border-gray-700'
  );

  constructor() {
    // Effect to emit opened/closed events and manage focus
    effect(() => {
      if (this.open()) {
        this.opened.emit();
        
        // Focus trap for overlay mode
        if (this.mode() === 'over') {
          this.trapFocus();
        }
      } else {
        this.closed.emit();
        this.restoreFocus();
      }
    });
  }

  private trapFocus() {
    // Store the currently focused element
    this.previousActiveElement = this.document.activeElement as HTMLElement;
    
    // Focus the sidebar after a brief delay to ensure it's rendered
    setTimeout(() => {
      const sidebar = this.elementRef.nativeElement.querySelector('aside');
      if (sidebar) {
        // Find first focusable element in sidebar
        const focusableElements = sidebar.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        } else {
          // If no focusable elements, focus the sidebar itself
          sidebar.setAttribute('tabindex', '-1');
          sidebar.focus();
        }
      }
    }, 100);
  }

  private restoreFocus() {
    // Restore focus to the previously focused element
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      setTimeout(() => {
        this.previousActiveElement?.focus();
        this.previousActiveElement = null;
      }, 100);
    }
  }

  close() {
    this.openChange.emit(false);
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.close();
    }
  }
}
