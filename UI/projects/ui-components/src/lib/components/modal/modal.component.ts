import { ChangeDetectionStrategy, Component, computed, input, output, signal, viewChild, ElementRef, effect, inject, DestroyRef } from '@angular/core';
import { FocusTrapService } from '../../utilities/focus-trap.service';
import { DismissService } from '../../utilities/dismiss.service';
import { PortalService } from '../../utilities/portal.service';
import { AriaHelpersService } from '../../utilities/aria-helpers.service';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'centered' | 'glass';

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
  open = input(false);
  size = input<ModalSize>('md');
  variant = input<ModalVariant>('default');
  title = input<string>('');
  closable = input(true);
  closeOnBackdrop = input(true);
  closeOnEscape = input(true);
  showHeader = input(true);
  closeLabel = input('Close modal');
  preventBodyScroll = input(true);

  opened = output<void>();
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
    const baseClasses = 'relative ui-transition-transform-opacity bg-white rounded-lg shadow-4 max-h-full overflow-hidden';
    
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
    return 'flex items-center justify-between p-6 border-b border-gray-200';
  });

  protected titleClasses = computed(() => {
    return 'text-lg font-semibold text-text-primary flex-1 mr-4';
  });

  protected closeButtonClasses = computed(() => {
    return 'text-gray-400 hover:text-gray-600 ui-focus-primary ui-transition-standard rounded-md p-1';
  });

  protected bodyClasses = computed(() => {
    const baseClasses = 'p-6';
    const scrollClasses = this.size() === 'full' ? 'overflow-y-auto flex-1' : 'max-h-96 overflow-y-auto';
    return `${baseClasses} ${scrollClasses}`;
  });

  protected footerClasses = computed(() => {
    return 'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50';
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

    // Prevent body scroll
    if (this.preventBodyScroll()) {
      document.body.style.overflow = 'hidden';
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

    // Restore body scroll
    if (this.preventBodyScroll()) {
      document.body.style.overflow = '';
    }

    this.ariaHelpers.announce('Modal closed', 'polite');
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