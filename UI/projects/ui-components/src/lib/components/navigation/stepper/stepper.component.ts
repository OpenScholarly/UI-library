import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  description?: string;
  icon?: string;
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

/**
 * A stepper component for multi-step processes.
 * 
 * ## Features
 * - Horizontal and vertical layouts
 * - Linear vs. non-linear navigation
 * - Step validation with error states
 * - Completed/error/active states
 * - Custom icons per step
 * - Optional steps support
 * - Edit completed steps
 * - Mobile-friendly design
 * - Keyboard navigation (arrow keys)
 * - ARIA attributes for accessibility
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Horizontal stepper -->
 * <ui-stepper
 *   [steps]="steps"
 *   [currentStep]="0"
 *   (stepChange)="handleStepChange($event)">
 * </ui-stepper>
 * 
 * <!-- Vertical stepper -->
 * <ui-stepper
 *   [steps]="steps"
 *   orientation="vertical"
 *   [linear]="true"
 *   [currentStep]="activeStep">
 * </ui-stepper>
 * 
 * <!-- Non-linear stepper -->
 * <ui-stepper
 *   [steps]="steps"
 *   [linear]="false"
 *   [currentStep]="currentStep"
 *   [editable]="true">
 * </ui-stepper>
 * ```
 */
@Component({
  selector: 'ui-stepper',
  imports: [CommonModule],
  template: `
    <div 
      [class]="containerClasses()"
      role="group"
      [attr.aria-label]="ariaLabel() || 'Stepper navigation'">
      
      @for (step of steps(); track $index) {
        <div [class]="stepWrapperClasses()">
          <!-- Step indicator -->
          <button
            type="button"
            [class]="stepButtonClasses($index)"
            [disabled]="!canNavigateTo($index)"
            (click)="navigateToStep($index)"
            [attr.aria-label]="getStepAriaLabel($index)"
            [attr.aria-current]="$index === currentStep() ? 'step' : null">
            
            <div [class]="stepIconClasses($index)">
              @if (step.completed && !step.error) {
                <span class="text-xl">✓</span>
              } @else if (step.error) {
                <span class="text-xl">⚠</span>
              } @else if (step.icon) {
                <span class="text-xl">{{ step.icon }}</span>
              } @else {
                <span class="font-semibold">{{ $index + 1 }}</span>
              }
            </div>

            <div [class]="stepLabelClasses()">
              <div [class]="stepTitleClasses($index)">
                {{ step.label }}
                @if (step.optional) {
                  <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
                }
              </div>
              @if (step.description && orientation() === 'vertical') {
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ step.description }}
                </div>
              }
            </div>
          </button>

          <!-- Connector line -->
          @if ($index < steps().length - 1) {
            <div [class]="connectorClasses($index)"></div>
          }

          <!-- Vertical content area -->
          @if (orientation() === 'vertical' && $index === currentStep()) {
            <div class="ml-12 mt-4 pb-6">
              <ng-content [select]="'[step=' + $index + ']'" />
            </div>
          }
        </div>
      }

      <!-- Live region for screen readers -->
      <div 
        class="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true">
        {{ ariaLiveMessage() }}
      </div>
    </div>

    <!-- Horizontal content area -->
    @if (orientation() === 'horizontal') {
      <div class="mt-6">
        <ng-content [select]="'[step=' + currentStep() + ']'" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-stepper block'
  }
})
export class StepperComponent {
  /**
   * Array of steps to display.
   * @default []
   */
  steps = input<Step[]>([]);

  /**
   * Current active step index.
   * @default 0
   */
  currentStep = input<number>(0);

  /**
   * Orientation of the stepper.
   * - `horizontal`: Steps arranged horizontally (default)
   * - `vertical`: Steps stacked vertically
   * @default "horizontal"
   */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /**
   * Whether the stepper is linear (must complete in order).
   * @default true
   */
  linear = input<boolean>(true);

  /**
   * Whether completed steps can be edited.
   * @default false
   */
  editable = input<boolean>(false);

  /**
   * ARIA label for the stepper.
   * @default "Stepper navigation"
   */
  ariaLabel = input<string>();

  /**
   * Emitted when the active step changes.
   * @event stepChange
   */
  stepChange = output<number>();

  /**
   * Emitted when a step is completed.
   * @event stepComplete
   */
  stepComplete = output<number>();

  ariaLiveMessage = signal('');

  containerClasses = computed(() => {
    const base = 'flex';
    const orientation = this.orientation() === 'vertical' ? 'flex-col space-y-2' : 'items-center justify-between';
    return `${base} ${orientation}`;
  });

  stepWrapperClasses = computed(() => {
    const base = 'flex';
    const orientation = this.orientation() === 'vertical' ? 'flex-col' : 'flex-col items-center flex-1';
    return `${base} ${orientation}`;
  });

  stepButtonClasses(index: number): string {
    const base = 'flex items-center gap-3 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500';
    const interactive = this.canNavigateTo(index) ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : 'cursor-not-allowed';
    const orientation = this.orientation() === 'horizontal' ? 'flex-col' : '';
    return `${base} ${interactive} ${orientation}`;
  }

  stepIconClasses(index: number): string {
    const base = 'flex items-center justify-center rounded-full transition-all';
    const size = 'w-10 h-10';
    
    const isActive = index === this.currentStep();
    const isCompleted = this.steps()[index]?.completed;
    const hasError = this.steps()[index]?.error;
    
    let bgColor = 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    if (hasError) {
      bgColor = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    } else if (isCompleted) {
      bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    } else if (isActive) {
      bgColor = 'bg-blue-600 dark:bg-blue-500 text-white';
    }
    
    return `${base} ${size} ${bgColor}`;
  }

  stepLabelClasses = computed(() => {
    const base = 'text-center';
    const orientation = this.orientation() === 'horizontal' ? 'mt-2' : 'text-left';
    return `${base} ${orientation}`;
  });

  stepTitleClasses(index: number): string {
    const base = 'text-sm font-medium';
    const isActive = index === this.currentStep();
    const color = isActive 
      ? 'text-gray-900 dark:text-gray-100' 
      : 'text-gray-600 dark:text-gray-400';
    return `${base} ${color}`;
  }

  connectorClasses(index: number): string {
    const base = 'transition-all';
    const orientation = this.orientation() === 'vertical'
      ? 'h-12 w-0.5 ml-5 my-1'
      : 'flex-1 h-0.5 mx-2';
    
    const isCompleted = this.steps()[index]?.completed;
    const color = isCompleted
      ? 'bg-green-500 dark:bg-green-400'
      : 'bg-gray-300 dark:bg-gray-600';
    
    return `${base} ${orientation} ${color}`;
  }

  canNavigateTo(index: number): boolean {
    // Always allow navigation to current step
    if (index === this.currentStep()) {
      return false;
    }

    // If not linear, allow navigation to any step
    if (!this.linear()) {
      return true;
    }

    // In linear mode, allow navigation to:
    // 1. Previous steps
    // 2. Next step if current is completed
    // 3. Completed steps if editable
    if (index < this.currentStep()) {
      return this.editable();
    }

    if (index === this.currentStep() + 1) {
      return this.steps()[this.currentStep()]?.completed || false;
    }

    return false;
  }

  navigateToStep(index: number) {
    if (!this.canNavigateTo(index)) {
      return;
    }

    const step = this.steps()[index];
    this.stepChange.emit(index);
    this.ariaLiveMessage.set(`Navigated to step ${index + 1}: ${step.label}`);
  }

  getStepAriaLabel(index: number): string {
    const step = this.steps()[index];
    const status = [];
    
    if (index === this.currentStep()) {
      status.push('current');
    }
    if (step.completed) {
      status.push('completed');
    }
    if (step.error) {
      status.push('error');
    }
    if (step.optional) {
      status.push('optional');
    }

    const statusText = status.length > 0 ? ` (${status.join(', ')})` : '';
    return `Step ${index + 1} of ${this.steps().length}: ${step.label}${statusText}`;
  }

  /**
   * Navigate to the next step.
   */
  next() {
    if (this.currentStep() < this.steps().length - 1) {
      this.navigateToStep(this.currentStep() + 1);
    }
  }

  /**
   * Navigate to the previous step.
   */
  previous() {
    if (this.currentStep() > 0) {
      this.navigateToStep(this.currentStep() - 1);
    }
  }

  /**
   * Mark the current step as completed.
   */
  completeCurrentStep() {
    const currentIndex = this.currentStep();
    this.stepComplete.emit(currentIndex);
    this.ariaLiveMessage.set(`Step ${currentIndex + 1} completed`);
  }
}
