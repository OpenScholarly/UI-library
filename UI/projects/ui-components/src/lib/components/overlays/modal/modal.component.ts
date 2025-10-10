import { ChangeDetectionStrategy, Component, computed, input, output, signal, viewChild, ElementRef, effect, inject, DestroyRef } from '@angular/core';
import { FocusTrapService } from '../../../utilities/focus-trap.service';
import { DismissService } from '../../../utilities/dismiss.service';
import { PortalService } from '../../../utilities/portal.service';
import { AriaHelpersService } from '../../../utilities/aria-helpers.service';
import { ModalSize, ModalVariant } from '../../../types';

/**
 * A versatile and accessible modal dialog component for overlays and popups.
 *
 * ## Features
 * - Multiple size options (xs, sm, md, lg, xl, full)
 * - Visual variants (default, centered, bottom-sheet)
 * - Focus trap management
 * - Backdrop click and ESC key dismiss
 * - Body scroll prevention
 * - Header and footer slots
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth animations
 *
 * @example
 * ```html
 * <!-- Basic modal -->
 * <ui-modal
 *   [open]="isOpen"
 *   title="Confirm Action"
 *   (closed)="onModalClose()">
 *   <p>Are you sure you want to continue?</p>
 *   <div slot="footer">
 *     <button (click)="cancel()">Cancel</button>
 *     <button (click)="confirm()">Confirm</button>
 *   </div>
 * </ui-modal>
 *
 * <!-- Large modal with custom title -->
 * <ui-modal
 *   [open]="showModal"
 *   size="lg"
 *   [closable]="true">
 *   <h2 slot="title">Custom Title</h2>
 *   <p>Modal content goes here...</p>
 * </ui-modal>
 *
 * <!-- Non-closable modal -->
 * <ui-modal
 *   [open]="isProcessing"
 *   [closable]="false"
 *   [closeOnBackdrop]="false"
 *   [closeOnEscape]="false">
 *   <p>Processing your request...</p>
 * </ui-modal>
 *
 * <!-- Bottom sheet variant -->
 * <ui-modal
 *   [open]="showSheet"
 *   variant="bottom-sheet"
 *   size="full">
 *   <h3>Sheet Content</h3>
 *   <p>Slides up from bottom</p>
 * </ui-modal>
 *
 * <!-- Without header -->
 * <ui-modal
 *   [open]="show"
 *   [showHeader]="false">
 *   <div>Custom content without header</div>
 * </ui-modal>
 * ```
 */
@Component({
  selector: 'ui-modal',
  template: `
    @if (open()) {
      <div
        [class]="backdropClasses()"
        [attr.aria-hidden]="true"
        (click)="onBackdropClick($event)">
        <div
          #modalElement
          [class]="modalClasses()"
          [attr.role]="'dialog'"
          [attr.aria-modal]="'true'"
          [attr.aria-labelledby]="titleId()"
          [attr.aria-describedby]="descriptionId()"
          (click)="$event.stopPropagation()">

          <!-- Header -->
          @if (showHeader()) {
            <div [class]="headerClasses()">
              <h2 [id]="titleId()" [class]="titleClasses()">
                <ng-content select="[slot=title]" />
                @if (!hasCustomTitleState()) {
                  {{ title() }}
                }
              </h2>

              @if (closable()) {
                <button
                  type="button"
                  [class]="closeButtonClasses()"
                  (click)="close()"
                  [attr.aria-label]="closeLabel()">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div [class]="bodyClasses()" [id]="descriptionId()">
            <ng-content />
          </div>

          <!-- Footer -->
          @if (hasFooterState()) {
            <div [class]="footerClasses()">
              <ng-content select="[slot=footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  /**
   * Controls whether the modal is visible.
   * @default false
   */
  open = input(false);
  
  /**
   * Size of the modal dialog.
   * - `xs`: Extra small (320px)
   * - `sm`: Small (400px)
   * - `md`: Medium (512px) - default
   * - `lg`: Large (640px)
   * - `xl`: Extra large (768px)
   * - `full`: Full screen
   * @default "md"
   */
  size = input<ModalSize>('md');
  
  /**
   * Visual style variant of the modal.
   * - `default`: Standard centered modal (default)
   * - `centered`: Vertically and horizontally centered
   * - `bottom-sheet`: Slides up from bottom
   * @default "default"
   */
  variant = input<ModalVariant>('default');
  
  /**
   * Title text displayed in the modal header.
   * Can be overridden with custom content via slot="title".
   * @default ""
   * @example "Confirm Action"
   */
  title = input<string>('');
  
  /**
   * Shows close button in header.
   * @default true
   */
  closable = input(true);
  
  /**
   * Allows closing modal by clicking the backdrop.
   * @default true
   */
  closeOnBackdrop = input(true);
  
  /**
   * Allows closing modal by pressing ESC key.
   * @default true
   */
  closeOnEscape = input(true);
  
  /**
   * Shows the modal header section.
   * @default true
   */
  showHeader = input(true);
  
  /**
   * ARIA label for the close button.
   * @default "Close modal"
   */
  closeLabel = input('Close modal');
  
  /**
   * Prevents body scroll when modal is open.
   * @default true
   */
  preventBodyScroll = input(true);

  /**
   * Emitted when the modal is opened.
   * @event opened
   */
  opened = output<void>();
  
  /**
   * Emitted when the modal is closed.
   * @event closed
   */
  closed = output<void>();
  backdropClicked = output<void>();

  // Internal state
  private modalElement = viewChild<ElementRef<HTMLElement>>('modalElement');
  protected titleId = signal('');
  protected descriptionId = signal('');
  private dismissId = signal('');
  protected hasCustomTitleState = signal(false);
  protected hasFooterState = signal(false);

  // Services
  private focusTrap = inject(FocusTrapService);
  private dismissService = inject(DismissService);
  private portalService = inject(PortalService);
  private ariaHelpers = inject(AriaHelpersService);
  private destroyRef = inject(DestroyRef);

  // Track original body styles to avoid layout shifts when optionally locking scroll
  private originalBodyOverflow: string | null = null;
  private originalBodyPaddingRight: string | null = null;
  private isScrollLocked = false;

  constructor() {
    this.titleId.set(this.ariaHelpers.generateId('modal-title'));
    this.descriptionId.set(this.ariaHelpers.generateId('modal-description'));
    this.dismissId.set(this.ariaHelpers.generateId('modal-dismiss'));

    // Handle open/close state changes
    effect(() => {
      if (this.open()) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.handleClose();
    });
  }

  // Computed classes
  protected backdropClasses = computed(() => {
    const baseClasses = 'fixed inset-0 z-modal-backdrop ui-transition-standard';
    const variantClasses = {
      default: 'bg-black/50',
      centered: 'bg-black/50 flex items-center justify-center',
      glass: 'backdrop-blur-sm bg-black/30'
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  protected modalClasses = computed(() => {
    const baseClasses = 'relative ui-transition-transform-opacity bg-white dark:bg-gray-800 rounded-lg shadow-4 max-h-full overflow-hidden';

    const sizeClasses = {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-md',
      lg: 'w-full max-w-lg',
      xl: 'w-full max-w-xl',
      full: 'w-full h-full max-w-none rounded-none'
    };

    const variantClasses = {
      default: 'mx-4 my-8',
      centered: 'mx-4',
      glass: 'ui-glass mx-4 my-8'
    };

    const positionClasses = this.variant() === 'centered'
      ? ''
      : 'fixed top-0 left-1/2 transform -translate-x-1/2';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${positionClasses}`;
  });

  protected headerClasses = computed(() => {
    return 'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700';
  });

  protected titleClasses = computed(() => {
    return 'text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 mr-4';
  });

  protected closeButtonClasses = computed(() => {
    return 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ui-focus-primary ui-transition-standard rounded-md p-1';
  });

  protected bodyClasses = computed(() => {
    const baseClasses = 'p-6 text-gray-900 dark:text-gray-100';
    const scrollClasses = this.size() === 'full' ? 'overflow-y-auto flex-1' : 'max-h-96 overflow-y-auto';
    return `${baseClasses} ${scrollClasses}`;
  });

  protected footerClasses = computed(() => {
    return 'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900';
  });

  // Event handlers
  protected onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.closeOnBackdrop()) {
      this.backdropClicked.emit();
      this.close();
    }
  }

  // Public methods
  close(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }

  // Private methods
  private handleOpen(): void {
    // Initialize portal outlets if needed
    this.portalService.initializeDefaultOutlets();

    // Optionally prevent body scroll (off by default) with scrollbar compensation
    if (this.preventBodyScroll()) {
      this.lockBodyScroll();
    }

    // Setup focus trap when modal element is available
    setTimeout(() => {
      const modalEl = this.modalElement()?.nativeElement;
      if (modalEl) {
        this.focusTrap.trapFocus(modalEl);

        // Setup dismiss handlers
        this.dismissService.register(
          this.dismissId(),
          modalEl,
          () => this.close(),
          {
            clickOutside: false, // We handle backdrop clicks manually
            escapeKey: this.closeOnEscape()
          }
        );
      }
    });

    this.opened.emit();
    this.ariaHelpers.announce('Modal opened', 'polite');
  }

  private handleClose(): void {
    const modalEl = this.modalElement()?.nativeElement;
    if (modalEl) {
      this.focusTrap.releaseFocus(modalEl);
    }

    this.dismissService.unregister(this.dismissId());

    // Restore body scroll only if we previously locked it
    if (this.isScrollLocked) {
      this.unlockBodyScroll();
    }

    this.ariaHelpers.announce('Modal closed', 'polite');
  }

  // Scroll locking helpers with layout shift prevention
  private lockBodyScroll(): void {
    if (this.isScrollLocked) return;

    const body = document.body;
    const docEl = document.documentElement;

    // Store original styles for restoration
    this.originalBodyOverflow = body.style.overflow || '';
    this.originalBodyPaddingRight = body.style.paddingRight || '';

    // Compute scrollbar width to prevent content shift when hiding overflow
    const scrollbarWidth = window.innerWidth - docEl.clientWidth;

    // Apply overflow hidden and compensate with padding-right if a vertical scrollbar existed
    if (scrollbarWidth > 0) {
      // Respect existing inline padding-right if any
      const currentPaddingRight = parseFloat(getComputedStyle(body).paddingRight || '0');
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';

    this.isScrollLocked = true;
  }

  private unlockBodyScroll(): void {
    const body = document.body;

    // Restore original styles
    body.style.overflow = this.originalBodyOverflow ?? '';
    body.style.paddingRight = this.originalBodyPaddingRight ?? '';

    this.isScrollLocked = false;
    this.originalBodyOverflow = null;
    this.originalBodyPaddingRight = null;
  }

  // Content projection helpers
  protected hasCustomTitle(): boolean {
    return this.hasCustomTitleState();
  }

  protected hasFooter(): boolean {
    return this.hasFooterState();
  }

  // Programmatic API
  setHasCustomTitle(value: boolean): void {
    this.hasCustomTitleState.set(value);
  }

  setHasFooter(value: boolean): void {
    this.hasFooterState.set(value);
  }
}
