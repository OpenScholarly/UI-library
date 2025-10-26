import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  effect,
  viewChild,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusTrapService } from '../../../utilities/focus-trap.service';
import { DismissService } from '../../../utilities/dismiss.service';

export type BottomSheetSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * A mobile-optimized modal that slides up from the bottom with drag-to-dismiss gesture.
 *
 * ## Features
 * - Slide up animation
 * - Drag to dismiss gesture
 * - Snap points support
 * - Backdrop support
 * - Scrollable content
 * - Handle for dragging
 * - Keyboard dismissal
 * - ARIA modal semantics
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic bottom sheet -->
 * <ui-bottom-sheet
 *   [open]="isOpen"
 *   title="Options"
 *   (close)="onClose()">
 *   <p>Sheet content goes here...</p>
 * </ui-bottom-sheet>
 *
 * <!-- With drag to dismiss -->
 * <ui-bottom-sheet
 *   [open]="isOpen"
 *   [dragToDismiss]="true"
 *   [snapPoints]="[0.3, 0.6, 1]"
 *   (close)="onClose()">
 *   <p>Drag the handle to dismiss or snap to different heights</p>
 * </ui-bottom-sheet>
 *
 * <!-- Full height -->
 * <ui-bottom-sheet
 *   [open]="isOpen"
 *   size="full"
 *   [showHandle]="true">
 *   <h2>Full screen content</h2>
 * </ui-bottom-sheet>
 * ```
 */
@Component({
  selector: 'ui-bottom-sheet',
  imports: [CommonModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        [class]="backdropClasses()"
        [attr.aria-hidden]="true"
        (click)="onBackdropClick()">
      </div>

      <!-- Bottom Sheet -->
      <div
        #sheetElement
        [class]="sheetClasses()"
        [style.transform]="'translateY(' + dragOffset() + 'px)'"
        role="dialog"
        [attr.aria-modal]="'true'"
        [attr.aria-labelledby]="titleId()"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()">
        
        <!-- Drag Handle -->
        @if (showHandle()) {
          <div class="flex justify-center py-3 cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        }

        <!-- Header -->
        @if (showHeader()) {
          <div [class]="headerClasses()">
            <h2 [id]="titleId()" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              <ng-content select="[slot=title]" />
              @if (!hasCustomTitle()) {
                {{ title() }}
              }
            </h2>

            @if (closable()) {
              <button
                type="button"
                class="ml-auto p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="onCloseClick()"
                [attr.aria-label]="'Close'">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            }
          </div>
        }

        <!-- Content -->
        <div [class]="contentClasses()">
          <ng-content />
        </div>

        <!-- Footer -->
        @if (hasFooter()) {
          <div [class]="footerClasses()">
            <ng-content select="[slot=footer]" />
          </div>
        }
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.fixed]': 'open()',
    '[class.inset-0]': 'open()',
    '[class.z-50]': 'open()',
    '[class.pointer-events-none]': '!open()',
  },
})
export class BottomSheetComponent {
  /**
   * Whether the bottom sheet is open.
   */
  open = input<boolean>(false);

  /**
   * Title text for the bottom sheet.
   */
  title = input<string>('');

  /**
   * Size of the bottom sheet.
   * @default "md"
   */
  size = input<BottomSheetSize>('md');

  /**
   * Whether to show the header.
   * @default true
   */
  showHeader = input<boolean>(true);

  /**
   * Whether to show the drag handle.
   * @default true
   */
  showHandle = input<boolean>(true);

  /**
   * Whether the bottom sheet can be closed.
   * @default true
   */
  closable = input<boolean>(true);

  /**
   * Whether clicking the backdrop closes the sheet.
   * @default true
   */
  closeOnBackdrop = input<boolean>(true);

  /**
   * Whether pressing Escape closes the sheet.
   * @default true
   */
  closeOnEscape = input<boolean>(true);

  /**
   * Whether drag to dismiss is enabled.
   * @default true
   */
  dragToDismiss = input<boolean>(true);

  /**
   * Snap points for the sheet (0-1 representing percentage of viewport).
   * @default [0.5, 1]
   */
  snapPoints = input<number[]>([0.5, 1]);

  /**
   * Emitted when the bottom sheet is closed.
   */
  close = output<void>();

  private sheetElement = viewChild<ElementRef>('sheetElement');
  private focusTrapService = inject(FocusTrapService);
  private dismissService = inject(DismissService);
  private destroyRef = inject(DestroyRef);

  dragOffset = signal<number>(0);
  private isDragging = signal<boolean>(false);
  private dragStartY = signal<number>(0);
  private currentSnapPoint = signal<number>(1);

  hasCustomTitle = signal<boolean>(false);
  hasFooter = signal<boolean>(false);

  titleId = computed(() => `bottom-sheet-title-${Math.random().toString(36).substr(2, 9)}`);

  backdropClasses = computed(() => {
    return 'fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out z-40';
  });

  sheetClasses = computed(() => {
    const heights = {
      sm: 'max-h-[40vh]',
      md: 'max-h-[60vh]',
      lg: 'max-h-[80vh]',
      full: 'h-full',
    };
    return `fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out z-50 ${heights[this.size()]}`;
  });

  headerClasses = computed(() => {
    return 'flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700';
  });

  contentClasses = computed(() => {
    const maxHeight = this.size() === 'full' ? 'flex-1' : 'max-h-[50vh]';
    return `px-6 py-4 overflow-y-auto ${maxHeight}`;
  });

  footerClasses = computed(() => {
    return 'flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900';
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.setupFocusTrap();
        this.setupDismissHandlers();
        document.body.style.overflow = 'hidden';
      } else {
        this.cleanupFocusTrap();
        this.cleanupDismissHandlers();
        document.body.style.overflow = '';
      }
    });
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop() && this.closable()) {
      this.close.emit();
    }
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.dragToDismiss() || !this.showHandle()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.cursor-grab')) return;

    this.isDragging.set(true);
    this.dragStartY.set(event.touches[0].clientY);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;

    const deltaY = event.touches[0].clientY - this.dragStartY();
    if (deltaY > 0) {
      this.dragOffset.set(deltaY);
    }
  }

  onTouchEnd(): void {
    if (!this.isDragging()) return;

    this.isDragging.set(false);
    const threshold = 100;

    if (this.dragOffset() > threshold) {
      this.close.emit();
    } else {
      // Snap to nearest snap point
      this.snapToNearest();
    }

    this.dragOffset.set(0);
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.dragToDismiss() || !this.showHandle()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.cursor-grab')) return;

    this.isDragging.set(true);
    this.dragStartY.set(event.clientY);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;

    const deltaY = event.clientY - this.dragStartY();
    if (deltaY > 0) {
      this.dragOffset.set(deltaY);
    }
  }

  onMouseUp(): void {
    if (!this.isDragging()) return;

    this.isDragging.set(false);
    const threshold = 100;

    if (this.dragOffset() > threshold) {
      this.close.emit();
    } else {
      this.snapToNearest();
    }

    this.dragOffset.set(0);
  }

  private snapToNearest(): void {
    const viewportHeight = window.innerHeight;
    const currentHeight = viewportHeight - this.dragOffset();
    const currentRatio = currentHeight / viewportHeight;

    const snapPoints = this.snapPoints();
    let nearestPoint = snapPoints[0];
    let minDiff = Math.abs(currentRatio - nearestPoint);

    for (const point of snapPoints) {
      const diff = Math.abs(currentRatio - point);
      if (diff < minDiff) {
        minDiff = diff;
        nearestPoint = point;
      }
    }

    this.currentSnapPoint.set(nearestPoint);
  }

  private setupFocusTrap(): void {
    setTimeout(() => {
      const element = this.sheetElement()?.nativeElement;
      if (element) {
        this.focusTrapService.trapFocus(element);
      }
    }, 100);
  }

  private cleanupFocusTrap(): void {
    const element = this.sheetElement()?.nativeElement;
    if (element) {
      this.focusTrapService.releaseFocus(element);
    }
  }

  private setupDismissHandlers(): void {
    if (this.closeOnEscape() && this.closable()) {
      const id = 'bottom-sheet-' + Math.random().toString(36).substr(2, 9);
      const element = this.sheetElement()?.nativeElement;
      if (element) {
        this.dismissService.register(id, element, () => {
          this.close.emit();
        }, { clickOutside: false, escapeKey: true });
        this.destroyRef.onDestroy(() => this.dismissService.unregister(id));
      }
    }
  }

  private cleanupDismissHandlers(): void {
    // Cleanup is handled by destroyRef
  }
}
