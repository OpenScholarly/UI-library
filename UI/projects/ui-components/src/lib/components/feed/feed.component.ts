import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export interface FeedItem {
  id: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  content: string;
  timestamp: Date;
  likes?: number;
  comments?: number;
  shares?: number;
  images?: string[];
  type?: 'text' | 'image' | 'video' | 'link';
  isLiked?: boolean;
  isBookmarked?: boolean;
}

@Component({
  selector: 'ui-feed',
  imports: [NgClass],
  template: `
    <div [class]="containerClasses()">
      @for (item of items(); track item.id) {
        <article [class]="itemClasses()">
          <!-- Header -->
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              @if (item.author.avatar) {
                <img
                  [src]="item.author.avatar"
                  [alt]="item.author.name"
                  class="w-full h-full object-cover"
                >
              } @else {
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ getInitials(item.author.name) }}
                </span>
              }
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.author.name }}</h3>
              @if (item.author.username) {
                <p class="text-sm text-gray-500 dark:text-gray-400">@{{ item.author.username }}</p>
              }
            </div>
            <time class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatTime(item.timestamp) }}
            </time>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ item.content }}</p>

            @if (item.images && item.images.length > 0) {
              <div class="mt-3 grid gap-2" [class]="getImageGridClass(item.images.length)">
                @for (image of item.images; track image) {
                  <img
                    [src]="image"
                    alt="Post image"
                    class="rounded-lg object-cover w-full h-48"
                  >
                }
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              [class.text-red-500]="item.isLiked"
              [class.dark:text-red-400]="item.isLiked"
              (click)="like.emit(item.id)"
            >
              <span class="text-lg">{{ item.isLiked ? '❤️' : '🤍' }}</span>
              @if (item.likes) {
                <span>{{ item.likes }}</span>
              }
            </button>

            <button
              type="button"
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              (click)="comment.emit(item.id)"
            >
              <span class="text-lg">💬</span>
              @if (item.comments) {
                <span>{{ item.comments }}</span>
              }
            </button>

            <button
              type="button"
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
              (click)="share.emit(item.id)"
            >
              <span class="text-lg">🔄</span>
              @if (item.shares) {
                <span>{{ item.shares }}</span>
              }
            </button>

            <button
              type="button"
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors ml-auto"
              [class.text-yellow-500]="item.isBookmarked"
              [class.dark:text-yellow-400]="item.isBookmarked"
              (click)="bookmark.emit(item.id)"
            >
              <span class="text-lg">{{ item.isBookmarked ? '🔖' : '📑' }}</span>
            </button>
          </div>
        </article>
      }

      @if (items().length === 0) {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📰</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
          <p class="text-gray-500 dark:text-gray-400">When people share posts, they'll appear here.</p>
        </div>
      }
    </div>
  `,
  host: {
    'class': 'ui-feed block'
  }
})
export class FeedComponent {
  items = input<FeedItem[]>([]);
  variant = input<'default' | 'compact' | 'minimal'>('default');

  like = output<string>();
  comment = output<string>();
  share = output<string>();
  bookmark = output<string>();

  containerClasses = computed(() => [
    'space-y-6',
    {
      'space-y-4': this.variant() === 'compact',
      'space-y-2': this.variant() === 'minimal'
    }
  ]);

  itemClasses = computed(() => [
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors',
    {
      'p-4': this.variant() === 'compact',
      'p-3 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none': this.variant() === 'minimal'
    }
  ]);

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return timestamp.toLocaleDateString();
  }

  getImageGridClass(count: number): string {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    return 'grid-cols-2';
  }
}
