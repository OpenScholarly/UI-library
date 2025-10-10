import { ChangeDetectionStrategy, Component, computed, input, output, signal, viewChild, ElementRef, inject, DestroyRef } from '@angular/core';
import { PositioningService, type Placement } from '../../../utilities/positioning.service';
import { PortalService } from '../../../utilities/portal.service';
import { AriaHelpersService } from '../../../utilities/aria-helpers.service';
import { TooltipTrigger, TooltipVariant } from '../../../types';

/**
 * A versatile and accessible tooltip component for contextual information.
 *
 * ## Features
 * - Multiple visual variants (default, dark, light, error, warning, success)
 * - 12 placement positions (top, bottom, left, right, and their start/end variants)
 * - Multiple trigger options (hover, focus, click)
 * - Configurable show/hide delays
 * - Optional arrow pointer
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Auto-positioning to stay within viewport
 * - Smooth fade-in animations
 *
 * @example
 * ```html
 * <!-- Basic tooltip -->
 * <ui-tooltip content="This is a helpful tip">
 *   <button>Hover me</button>
 * </ui-tooltip>
 *
 * <!-- Tooltip with placement -->
 * <ui-tooltip content="Appears on the right" placement="right">
 *   <span>Right tooltip</span>
 * </ui-tooltip>
 *
 * <!-- Tooltip with click trigger -->
 * <ui-tooltip
 *   content="Click to toggle"
 *   trigger="click"
 *   placement="bottom">
 *   <button>Click me</button>
 * </ui-tooltip>
 *
 * <!-- Error tooltip -->
 * <ui-tooltip
 *   content="Invalid input format"
 *   variant="error"
 *   placement="top">
 *   <input type="text" />
 * </ui-tooltip>
 *
 * <!-- Tooltip with delay -->
 * <ui-tooltip
 *   content="Delayed tooltip"
 *   [delay]="500"
 *   [hideDelay]="200">
 *   <button>Wait for it...</button>
 * </ui-tooltip>
 *
 * <!-- Tooltip without arrow -->
 * <ui-tooltip
 *   content="No arrow pointer"
 *   [showArrow]="false">
 *   <span>No arrow</span>
 * </ui-tooltip>
 *
 * <!-- Light variant tooltip -->
 * <ui-tooltip
 *   content="Light themed tooltip"
 *   variant="light"
 *   placement="bottom-start">
 *   <button>Light tooltip</button>
 * </ui-tooltip>
 * ```
 */
@Component({
  selector: 'ui-tooltip',
  standalone: true,
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
  /**
   * Text content to display in the tooltip.
   * @required
   * @example "Click to copy"
   */
  content = input.required<string>();
  
  /**
   * Position of the tooltip relative to the trigger element.
   * Supports 12 positions: top, bottom, left, right, and their -start/-end variants.
   * @default "top"
   * @example "bottom-start", "right", "top-end"
   */
  placement = input<Placement>('top');
  
  /**
   * Event that triggers the tooltip to show.
   * - `hover`: Show on mouse hover (default)
   * - `focus`: Show on focus
   * - `click`: Show on click, hide on second click
   * @default "hover"
   */
  trigger = input<TooltipTrigger>('hover');
  
  /**
   * Visual style variant of the tooltip.
   * - `default`: Dark gray tooltip (default)
   * - `dark`: Darker gray tooltip
   * - `light`: Light background with border
   * - `error`: Red error tooltip
   * - `warning`: Yellow warning tooltip
   * - `success`: Green success tooltip
   * @default "default"
   */
  variant = input<TooltipVariant>('default');
  
  /**
   * Delay in milliseconds before showing the tooltip.
   * @default 0
   * @example 500 for half-second delay
   */
  delay = input(0);
  
  /**
   * Delay in milliseconds before hiding the tooltip.
   * @default 0
   * @example 200 for slight delay before hiding
   */
  hideDelay = input(0);
  
  /**
   * Disables the tooltip completely.
   * When true, tooltip will not show regardless of trigger.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Shows or hides the arrow pointer on the tooltip.
   * @default true
   */
  showArrow = input(true);
  
  /**
   * Distance in pixels between the tooltip and trigger element.
   * @default 8
   */
  offset = input(8);

  /**
   * Emitted when the tooltip is opened/shown.
   * @event opened
   */
  opened = output<void>();
  
  /**
   * Emitted when the tooltip is closed/hidden.
   * @event closed
   */
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
      default: 'bg-gray-900 dark:bg-gray-800 text-white',
      dark: 'bg-gray-800 dark:bg-gray-900 text-white',
      light: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600',
      error: 'bg-red-600 dark:bg-red-700 text-white',
      warning: 'bg-yellow-500 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100',
      success: 'bg-green-600 dark:bg-green-700 text-white'
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  protected arrowClasses = computed(() => {
    const baseClasses = 'absolute w-2 h-2 transform rotate-45';

    const variantClasses = {
      default: 'bg-gray-900 dark:bg-gray-800',
      dark: 'bg-gray-800 dark:bg-gray-900',
      light: 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600',
      error: 'bg-red-600 dark:bg-red-700',
      warning: 'bg-yellow-500 dark:bg-yellow-600',
      success: 'bg-green-600 dark:bg-green-700'
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
