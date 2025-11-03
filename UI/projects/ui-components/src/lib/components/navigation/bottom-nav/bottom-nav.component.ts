import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Navigation item interface for bottom navigation
 */
export interface BottomNavItem {
  /** Unique identifier for the nav item */
  id: string;
  /** Display label */
  label: string;
  /** Icon (emoji or icon class) */
  icon: string;
  /** Optional badge text */
  badge?: string;
  /** Badge color variant */
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error';
  /** Whether item is disabled */
  disabled?: boolean;
  /** Navigation route or action handler */
  route?: string;
}

/**
 * Bottom Navigation Component
 * 
 * A mobile-optimized navigation bar fixed at the bottom of the screen.
 * Supports 3-5 navigation items with icons, labels, badges, and active state indicators.
 * 
 * @example
 * ```typescript
 * <ui-bottom-nav
 *   [items]="navItems"
 *   [activeId]="'home'"
 *   (itemClick)="handleNavClick($event)">
 * </ui-bottom-nav>
 * 
 * navItems: BottomNavItem[] = [
 *   { id: 'home', label: 'Home', icon: '🏠' },
 *   { id: 'search', label: 'Search', icon: '🔍' },
 *   { id: 'notifications', label: 'Alerts', icon: '🔔', badge: '3' },
 *   { id: 'profile', label: 'Profile', icon: '👤' }
 * ];
 * ```
 * 
 * Features:
 * - 3-5 navigation items recommended
 * - Active state with indicator
 * - Badge support with color variants
 * - Icons with labels
 * - Smooth transitions
 * - Fixed positioning at bottom
 * - Touch-friendly targets (min 44px)
 * - Full ARIA support
 * - WCAG 2.1 Level AA compliant
 */
@Component({
  selector: 'ui-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav 
      class="bottom-nav"
      role="navigation"
      [attr.aria-label]="ariaLabel()">
      <button
        *ngFor="let item of items()"
        type="button"
        class="bottom-nav-item"
        [class.active]="item.id === activeId()"
        [class.disabled]="item.disabled"
        [disabled]="item.disabled"
        [attr.aria-label]="item.label"
        [attr.aria-current]="item.id === activeId() ? 'page' : null"
        (click)="onItemClick(item)">
        
        <!-- Icon with badge -->
        <span class="bottom-nav-icon">
          {{ item.icon }}
          <span 
            *ngIf="item.badge"
            class="bottom-nav-badge"
            [class]="'badge-' + (item.badgeVariant || 'primary')"
            [attr.aria-label]="item.badge + ' notifications'">
            {{ item.badge }}
          </span>
        </span>
        
        <!-- Label -->
        <span class="bottom-nav-label">{{ item.label }}</span>
        
        <!-- Active indicator -->
        <span 
          *ngIf="item.id === activeId()"
          class="bottom-nav-indicator"
          aria-hidden="true">
        </span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: var(--ui-surface-primary, #ffffff);
      border-top: 1px solid var(--ui-border-color, #e5e7eb);
      padding: 0.25rem 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      transition: transform 0.3s ease;
    }

    @media (prefers-color-scheme: dark) {
      .bottom-nav {
        background-color: var(--ui-surface-primary, #1f2937);
        border-top-color: var(--ui-border-color, #374151);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
      }
    }

    .bottom-nav-item {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.5rem;
      min-height: 56px;
      min-width: 44px;
      background: none;
      border: none;
      color: var(--ui-text-secondary, #6b7280);
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    .bottom-nav-item:hover:not(.disabled) {
      color: var(--ui-primary, #3b82f6);
      background-color: var(--ui-surface-hover, rgba(59, 130, 246, 0.05));
    }

    .bottom-nav-item:focus-visible {
      outline: 2px solid var(--ui-primary, #3b82f6);
      outline-offset: -2px;
      border-radius: 0.375rem;
    }

    .bottom-nav-item.active {
      color: var(--ui-primary, #3b82f6);
    }

    .bottom-nav-item.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .bottom-nav-icon {
      position: relative;
      font-size: 1.5rem;
      line-height: 1;
      transition: transform 0.2s ease;
    }

    .bottom-nav-item.active .bottom-nav-icon {
      transform: scale(1.1);
    }

    .bottom-nav-label {
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
      transition: opacity 0.2s ease;
    }

    .bottom-nav-badge {
      position: absolute;
      top: -4px;
      right: -8px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
      font-size: 0.625rem;
      font-weight: 600;
      line-height: 1;
      border-radius: 9px;
      color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .badge-primary {
      background-color: var(--ui-primary, #3b82f6);
    }

    .badge-success {
      background-color: var(--ui-success, #10b981);
    }

    .badge-warning {
      background-color: var(--ui-warning, #f59e0b);
    }

    .badge-error {
      background-color: var(--ui-error, #ef4444);
    }

    .bottom-nav-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 3px;
      background-color: var(--ui-primary, #3b82f6);
      border-radius: 1.5px 1.5px 0 0;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        width: 32px;
        opacity: 1;
      }
    }

    /* Responsive adjustments */
    @media (min-width: 768px) {
      .bottom-nav {
        display: none; /* Hide on larger screens - use sidebar instead */
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .bottom-nav,
      .bottom-nav-item,
      .bottom-nav-icon,
      .bottom-nav-label,
      .bottom-nav-indicator {
        transition: none;
        animation: none;
      }
    }
  `]
})
export class BottomNavComponent {
  /** Navigation items to display */
  @Input() set navItems(value: BottomNavItem[]) {
    this.items.set(value);
  }

  /** Currently active item ID */
  @Input() set active(value: string) {
    this.activeId.set(value);
  }

  /** ARIA label for the navigation */
  @Input() set label(value: string) {
    this.ariaLabel.set(value);
  }

  /** Emitted when a nav item is clicked */
  @Output() itemClick = new EventEmitter<BottomNavItem>();

  /** Signal for navigation items */
  items = signal<BottomNavItem[]>([]);

  /** Signal for active item ID */
  activeId = signal<string>('');

  /** Signal for ARIA label */
  ariaLabel = signal<string>('Bottom navigation');

  /**
   * Handle navigation item click
   */
  onItemClick(item: BottomNavItem): void {
    if (item.disabled) {
      return;
    }

    this.activeId.set(item.id);
    this.itemClick.emit(item);
  }
}
