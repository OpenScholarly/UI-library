import { ChangeDetectionStrategy, Component, computed, input, output, signal, viewChild, ElementRef, inject, DestroyRef } from '@angular/core';
import { PositioningService, type Placement } from '../../utilities/positioning.service';
import { PortalService } from '../../utilities/portal.service';
import { AriaHelpersService } from '../../utilities/aria-helpers.service';

export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';
export type TooltipVariant = 'default' | 'dark' | 'light' | 'error' | 'warning' | 'success';

@Component({
  selector: 'ui-tooltip',
  template: `
    <div 
      #triggerElement
      [class]="wrapperClasses()"
      [attr.aria-describedby]="isOpen() ? tooltipId() : null"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (click)="onClick()">
      <ng-content />
    </div>
    
    @if (isOpen()) {
      <div
        #tooltipElement
        [id]="tooltipId()"
        [class]="tooltipClasses()"
        role="tooltip"
        [attr.aria-hidden]="false">
        {{ content() }}
        @if (showArrow()) {
          <div [class]="arrowClasses()"></div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  content = input.required<string>();
  placement = input<Placement>('top');
  trigger = input<TooltipTrigger>('hover');
  variant = input<TooltipVariant>('default');
  delay = input(0);
  hideDelay = input(0);
  disabled = input(false);
  showArrow = input(true);
  offset = input(8);

  opened = output<void>();
  closed = output<void>();

  // Internal state
  private triggerElement = viewChild<ElementRef<HTMLElement>>('triggerElement');
  private tooltipElement = viewChild<ElementRef<HTMLElement>>('tooltipElement');
  protected tooltipId = signal('');
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private isOpenState = signal(false);

  // Services
  private positioningService = inject(PositioningService);
  private portalService = inject(PortalService);
  private ariaHelpers = inject(AriaHelpersService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.tooltipId.set(this.ariaHelpers.generateId('tooltip'));

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.hide();
      this.clearTimeouts();
    });
  }

  // Computed properties
  protected wrapperClasses = computed(() => {
    return 'inline-block';
  });

  protected tooltipClasses = computed(() => {
    const baseClasses = 'absolute px-2 py-1 text-sm rounded shadow-lg z-tooltip max-w-xs pointer-events-none';
    
    const variantClasses = {
      default: 'bg-gray-900 text-white',
      dark: 'bg-gray-800 text-white',
      light: 'bg-white text-gray-900 border border-gray-200',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-500 text-yellow-900',
      success: 'bg-green-600 text-white'
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  protected arrowClasses = computed(() => {
    const baseClasses = 'absolute w-2 h-2 transform rotate-45';
    
    const variantClasses = {
      default: 'bg-gray-900',
      dark: 'bg-gray-800',
      light: 'bg-white border border-gray-200',
      error: 'bg-red-600',
      warning: 'bg-yellow-500',
      success: 'bg-green-600'
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  // Public getters
  isOpen(): boolean {
    return this.isOpenState();
  }

  // Event handlers
  protected onMouseEnter(): void {
    if (this.trigger() === 'hover' || this.trigger() === 'focus') {
      this.show();
    }
  }

  protected onMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this.hide();
    }
  }

  protected onFocus(): void {
    if (this.trigger() === 'focus' || this.trigger() === 'hover') {
      this.show();
    }
  }

  protected onBlur(): void {
    if (this.trigger() === 'focus') {
      this.hide();
    }
  }

  protected onClick(): void {
    if (this.trigger() === 'click') {
      if (this.isOpen()) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  // Public methods
  show(): void {
    if (this.disabled() || this.isOpen()) {
      return;
    }

    this.clearTimeouts();

    if (this.delay() > 0) {
      this.showTimeout = window.setTimeout(() => {
        this.doShow();
      }, this.delay());
    } else {
      this.doShow();
    }
  }

  hide(): void {
    if (!this.isOpen()) {
      return;
    }

    this.clearTimeouts();

    if (this.hideDelay() > 0) {
      this.hideTimeout = window.setTimeout(() => {
        this.doHide();
      }, this.hideDelay());
    } else {
      this.doHide();
    }
  }

  toggle(): void {
    if (this.isOpen()) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Private methods
  private doShow(): void {
    if (this.disabled()) {
      return;
    }

    this.isOpenState.set(true);
    this.opened.emit();

    // Position the tooltip after it's rendered
    setTimeout(() => {
      this.updatePosition();
    });
  }

  private doHide(): void {
    this.isOpenState.set(false);
    this.closed.emit();
  }

  private updatePosition(): void {
    const triggerEl = this.triggerElement()?.nativeElement;
    const tooltipEl = this.tooltipElement()?.nativeElement;

    if (!triggerEl || !tooltipEl) {
      return;
    }

    const result = this.positioningService.position(
      triggerEl,
      tooltipEl,
      {
        placement: this.placement(),
        offset: this.offset(),
        flip: true,
        shift: true,
        arrow: this.showArrow(),
        arrowElement: this.showArrow() ? tooltipEl.querySelector('.arrow') as HTMLElement : undefined
      }
    );

    this.positioningService.applyPosition(tooltipEl, result);
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}