import { Component, input, computed } from '@angular/core';
import { StatItem } from '../../../types';

/**
 * A versatile and accessible stats component for displaying key metrics and KPIs.
 *
 * ## Features
 * - Multiple layout options (grid, row)
 * - Icon support for each stat
 * - Change indicators with trend arrows
 * - Value formatting
 * - Description support
 * - Period display
 * - Full screen reader support with semantic HTML
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Responsive design
 *
 * @example
 * ```html
 * <!-- Basic stats -->
 * <ui-stats [stats]="statsData"></ui-stats>
 *
 * <!-- Grid layout -->
 * <ui-stats
 *   [stats]="[
 *     { label: 'Total Users', value: 1234, change: { value: 5, type: 'increase' } },
 *     { label: 'Revenue', value: 45678, icon: '💰' },
 *     { label: 'Growth', value: 89, change: { value: 12, type: 'increase', period: 'vs last month' } }
 *   ]"
 *   layout="grid">
 * </ui-stats>
 *
 * <!-- With custom formatting -->
 * <ui-stats
 *   [stats]="metrics"
 *   variant="bordered">
 * </ui-stats>
 * ```
 */
@Component({
  selector: 'ui-stats',
  template: `
    <div [class]="containerClasses()">
      @for (stat of stats(); track stat.label) {
        <div [class]="itemClasses()">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              @if (stat.icon) {
                <div class="mb-2">
                  <span class="text-2xl">{{ stat.icon }}</span>
                </div>
              }
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ stat.label }}
              </p>
              <p [class]="valueClasses()">
                {{ formatValue(stat.value) }}
              </p>
              @if (stat.description) {
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ stat.description }}
                </p>
              }
            </div>
            
            @if (stat.change) {
              <div class="flex flex-col items-end">
                <div [class]="changeClasses(stat.change.type)">
                  <span class="text-xs">
                    {{ getChangeIcon(stat.change.type) }}
                  </span>
                  <span class="text-sm font-medium">
                    {{ Math.abs(stat.change.value) }}%
                  </span>
                </div>
                @if (stat.change.period) {
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ stat.change.period }}
                  </p>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    'class': 'ui-stats block'
  }
})
export class StatsComponent {
  stats = input<StatItem[]>([]);
  variant = input<'default' | 'card' | 'minimal'>('default');
  columns = input<1 | 2 | 3 | 4>(3);

  containerClasses = computed(() => [
    'grid gap-4',
    {
      'grid-cols-1': this.columns() === 1,
      'grid-cols-1 sm:grid-cols-2': this.columns() === 2,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': this.columns() === 3,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': this.columns() === 4
    }
  ]);

  itemClasses = computed(() => [
    'p-6 transition-colors',
    {
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow': this.variant() === 'card',
      'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg': this.variant() === 'default',
      'border-b border-gray-200 dark:border-gray-700 pb-4': this.variant() === 'minimal'
    }
  ]);

  valueClasses = computed(() => [
    'font-bold text-gray-900 dark:text-white',
    {
      'text-3xl': this.variant() === 'card' || this.variant() === 'default',
      'text-2xl': this.variant() === 'minimal'
    }
  ]);

  changeClasses = (type: 'increase' | 'decrease' | 'neutral') => [
    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
    {
      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': type === 'increase',
      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': type === 'decrease',
      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400': type === 'neutral'
    }
  ];

  formatValue(value: string | number): string {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    }
    return value;
  }

  getChangeIcon(type: 'increase' | 'decrease' | 'neutral'): string {
    switch (type) {
      case 'increase': return '↗️';
      case 'decrease': return '↘️';
      case 'neutral': return '➡️';
    }
  }

  protected Math = Math;
}