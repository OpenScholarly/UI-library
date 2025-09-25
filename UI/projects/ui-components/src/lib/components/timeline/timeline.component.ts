import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  status?: 'completed' | 'active' | 'pending' | 'cancelled';
  icon?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

@Component({
  selector: 'ui-timeline',
  imports: [NgClass],
  template: `
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      <div class="space-y-6">
        @for (item of items(); track item.id; let isLast = $last) {
          <div class="relative flex items-start gap-4" (click)="onItemClick.emit(item.id)">
            <!-- Timeline marker -->
            <div [class]="markerClasses(item.status)">
              @if (item.icon) {
                <span class="text-xs">{{ item.icon }}</span>
              } @else {
                <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
              }
            </div>
            
            <!-- Content -->
            <div [class]="contentClasses()" class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 [class]="titleClasses(item.status)">
                    {{ item.title }}
                  </h3>
                  @if (item.description) {
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {{ item.description }}
                    </p>
                  }
                  @if (item.user) {
                    <div class="flex items-center gap-2 mt-2">
                      @if (item.user.avatar) {
                        <img 
                          [src]="item.user.avatar"
                          [alt]="item.user.name"
                          class="w-4 h-4 rounded-full"
                        >
                      }
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.user.name }}
                      </span>
                    </div>
                  }
                </div>
                
                <time class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {{ formatTime(item.timestamp) }}
                </time>
              </div>
              
              @if (item.metadata && showMetadata()) {
                <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    @for (entry of getMetadataEntries(item.metadata); track entry.key) {
                      <div>
                        <span class="text-gray-500 dark:text-gray-400">{{ entry.key }}:</span>
                        <span class="ml-1 text-gray-900 dark:text-white">{{ entry.value }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
      
      @if (items().length === 0) {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No timeline items</h3>
          <p class="text-gray-500 dark:text-gray-400">Timeline events will appear here when available.</p>
        </div>
      }
    </div>
  `,
  host: {
    'class': 'ui-timeline block'
  }
})
export class TimelineComponent {
  items = input<TimelineItem[]>([]);
  variant = input<'default' | 'compact' | 'detailed'>('default');
  showMetadata = input<boolean>(false);
  clickable = input<boolean>(false);
  
  onItemClick = output<string>();

  markerClasses = (status?: string) => [
    'flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 z-10',
    {
      'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 ring-4 ring-green-100 dark:ring-green-900/20': status === 'completed',
      'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/20': status === 'active',
      'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500': status === 'pending',
      'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 ring-4 ring-red-100 dark:ring-red-900/20': status === 'cancelled',
      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400': !status
    }
  ];

  contentClasses = computed(() => [
    'pb-6',
    {
      'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3 -m-3 transition-colors': this.clickable(),
      'pb-4': this.variant() === 'compact'
    }
  ]);

  titleClasses = (status?: string) => [
    'font-semibold',
    {
      'text-gray-900 dark:text-white': status === 'completed' || status === 'active' || !status,
      'text-gray-500 dark:text-gray-400': status === 'pending',
      'text-red-600 dark:text-red-400 line-through': status === 'cancelled'
    }
  ];

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return timestamp.toLocaleDateString();
  }

  getMetadataEntries(metadata: Record<string, any>): { key: string; value: string }[] {
    return Object.entries(metadata).map(([key, value]) => ({
      key: key.charAt(0).toUpperCase() + key.slice(1),
      value: String(value)
    }));
  }
}