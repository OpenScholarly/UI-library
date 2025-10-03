import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { TableColumn, TableRow, TableSize, TableVariant, SortDirection } from '../../../types';

@Component({
  selector: 'ui-table',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      <table [class]="tableClasses()">
        <!-- Header -->
        <thead [class]="headerClasses()">
          <tr>
            @for (column of columns(); track column.key) {
              <th
                [class]="headerCellClasses(column)"
                [style.width]="column.width"
                (click)="handleSort(column)">
                <div class="flex items-center gap-2">
                  <span>{{ column.label }}</span>
                  @if (column.sortable) {
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3 transition-colors"
                        [class.text-primary-600]="sortColumn() === column.key && sortDirection() === 'asc'"
                        [class.text-gray-400]="sortColumn() !== column.key || sortDirection() !== 'asc'"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
                      </svg>
                      <svg
                        class="w-3 h-3 transition-colors -mt-1"
                        [class.text-primary-600]="sortColumn() === column.key && sortDirection() === 'desc'"
                        [class.text-gray-400]="sortColumn() !== column.key || sortDirection() !== 'desc'"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  }
                </div>
              </th>
            }
          </tr>
        </thead>

        <!-- Body -->
        <tbody [class]="bodyClasses()">
          @if (sortedData().length === 0) {
            <tr>
              <td [attr.colspan]="columns().length" [class]="emptyCellClasses()">
                {{ emptyMessage() }}
              </td>
            </tr>
          } @else {
            @for (row of sortedData(); track $index; let i = $index) {
              <tr
                [class]="rowClasses(i)"
                (click)="handleRowClick(row, i)">
                @for (column of columns(); track column.key) {
                  <td [class]="cellClasses(column)">
                    {{ getCellValue(row, column) }}
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends TableRow = TableRow> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  size = input<TableSize>('md');
  variant = input<TableVariant>('default');
  hover = input(true);
  selectable = input(false);
  loading = input(false);
  emptyMessage = input('No data available');

  rowClicked = output<{ row: T; index: number }>();
  sortChanged = output<{ column: keyof T; direction: SortDirection }>();

  protected sortColumn = signal<keyof T | null>(null);
  protected sortDirection = signal<SortDirection>(null);

  protected sortedData = computed(() => {
    const data = this.data();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column || !direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal === bVal) return 0;

      const result = aVal < bVal ? -1 : 1;
      return direction === 'desc' ? -result : result;
    });
  });

  protected containerClasses = computed(() => {
    const baseClasses = 'overflow-x-auto';
    const loadingClasses = this.loading() ? 'opacity-60 pointer-events-none' : '';

    return `${baseClasses} ${loadingClasses}`.trim();
  });

  protected tableClasses = computed(() => {
    const baseClasses = 'w-full table-auto';

    const variantClasses = {
      default: '',
      striped: '',
      bordered: 'border border-gray-200 dark:border-gray-700'
    };

    const variantClass = variantClasses[this.variant()];

    return `${baseClasses} ${variantClass}`.trim();
  });

  protected headerClasses = computed(() => {
    return 'bg-gray-50 dark:bg-gray-800';
  });

  protected headerCellClasses = (column: TableColumn<T>) => {
    const baseClasses = 'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700';

    const sizeClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4'
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    const sortableClasses = column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none' : '';
    const sizeClass = sizeClasses[this.size()];
    const alignClass = alignClasses[column.align || 'left'];

    return `${baseClasses} ${sizeClass} ${alignClass} ${sortableClasses}`.trim();
  };

  protected bodyClasses = computed(() => {
    const variantClasses = {
      default: 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700',
      striped: 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700',
      bordered: 'bg-white dark:bg-gray-900'
    };

    return variantClasses[this.variant()];
  });

  protected rowClasses = (index: number) => {
    const baseClasses = 'transition-colors duration-200';

    const hoverClasses = this.hover() ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : '';
    const selectableClasses = this.selectable() ? 'cursor-pointer' : '';

    const stripedClasses = this.variant() === 'striped' && index % 2 === 1
      ? 'bg-gray-50 dark:bg-gray-800'
      : '';

    const borderedClasses = this.variant() === 'bordered'
      ? 'border-b border-gray-200 dark:border-gray-700'
      : '';

    return `${baseClasses} ${hoverClasses} ${selectableClasses} ${stripedClasses} ${borderedClasses}`.trim();
  };

  protected cellClasses = (column: TableColumn<T>) => {
    const baseClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base'
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    const sizeClass = sizeClasses[this.size()];
    const alignClass = alignClasses[column.align || 'left'];

    return `${baseClasses} ${sizeClass} ${alignClass}`.trim();
  };

  protected emptyCellClasses = computed(() => {
    const baseClasses = 'px-4 py-8 text-center text-gray-500 dark:text-gray-400';

    const sizeClasses = {
      sm: 'px-3 py-6',
      md: 'px-4 py-8',
      lg: 'px-6 py-10'
    };

    const sizeClass = sizeClasses[this.size()];

    return `${baseClasses} ${sizeClass}`.trim();
  });

  protected handleSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    const currentColumn = this.sortColumn();
    const currentDirection = this.sortDirection();

    if (currentColumn === column.key) {
      // Cycle through: asc -> desc -> null
      const newDirection = currentDirection === 'asc' ? 'desc' : currentDirection === 'desc' ? null : 'asc';
      this.sortDirection.set(newDirection);
      if (!newDirection) {
        this.sortColumn.set(null);
      }
    } else {
      // New column, start with asc
      this.sortColumn.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sortChanged.emit({
      column: this.sortColumn() as keyof T,
      direction: this.sortDirection()
    });
  }

  protected handleRowClick(row: T, index: number): void {
    if (this.selectable()) {
      this.rowClicked.emit({ row, index });
    }
  }

  protected getCellValue(row: T, column: TableColumn<T>): string {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    return String(value ?? '');
  }
}
