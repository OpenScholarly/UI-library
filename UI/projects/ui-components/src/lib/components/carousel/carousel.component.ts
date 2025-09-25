import { Component, input, output, computed, signal, effect, ElementRef, inject } from '@angular/core';
import { NgClass } from '@angular/common';

export interface CarouselItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
}

@Component({
  selector: 'ui-carousel',
  imports: [NgClass],
  template: `
    <div [class]="containerClasses()" [attr.aria-label]="ariaLabel() || 'Carousel'">
      <!-- Main carousel content -->
      <div class="relative overflow-hidden rounded-lg">
        <div 
          class="flex transition-transform duration-300 ease-in-out"
          [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'"
        >
          @for (item of items(); track item.id; let index = $index) {
            <div class="w-full flex-shrink-0" [attr.aria-hidden]="index !== currentIndex()">
              @if (item.image) {
                <div class="relative">
                  <img 
                    [src]="item.image" 
                    [alt]="item.title || 'Carousel item'"
                    [class]="imageClasses()"
                  >
                  @if (item.title || item.description) {
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div class="p-6 text-white">
                        @if (item.title) {
                          <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
                        }
                        @if (item.description) {
                          <p class="text-sm opacity-90">{{ item.description }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div [class]="contentClasses()">
                  @if (item.title) {
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {{ item.title }}
                    </h3>
                  }
                  @if (item.description) {
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                      {{ item.description }}
                    </p>
                  }
                  @if (item.content) {
                    <div class="text-gray-900 dark:text-white">
                      {{ item.content }}
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
        
        <!-- Navigation arrows -->
        @if (showArrows() && items().length > 1) {
          <button
            type="button"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            (click)="previous()"
            [attr.aria-label]="'Previous slide'"
            [disabled]="!infinite() && currentIndex() === 0"
            [class.opacity-50]="!infinite() && currentIndex() === 0"
          >
            <span class="text-lg">‹</span>
          </button>
          
          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            (click)="next()"
            [attr.aria-label]="'Next slide'"
            [disabled]="!infinite() && currentIndex() === items().length - 1"
            [class.opacity-50]="!infinite() && currentIndex() === items().length - 1"
          >
            <span class="text-lg">›</span>
          </button>
        }
      </div>
      
      <!-- Indicators -->
      @if (showIndicators() && items().length > 1) {
        <div class="flex justify-center gap-2 mt-4">
          @for (item of items(); track item.id; let index = $index) {
            <button
              type="button"
              class="w-2 h-2 rounded-full transition-colors"
              [class.bg-primary-600]="index === currentIndex()"
              [class.bg-gray-300]="index !== currentIndex()"
              [class.dark:bg-primary-400]="index === currentIndex()"
              [class.dark:bg-gray-600]="index !== currentIndex()"
              (click)="goToSlide(index)"
              [attr.aria-label]="'Go to slide ' + (index + 1)"
            ></button>
          }
        </div>
      }
      
      @if (items().length === 0) {
        <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="text-6xl mb-4">🎠</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No items to display</h3>
          <p class="text-gray-500 dark:text-gray-400">Add some items to see the carousel in action.</p>
        </div>
      }
    </div>
  `,
  host: {
    'class': 'ui-carousel block'
  }
})
export class CarouselComponent {
  private elementRef = inject(ElementRef);
  
  items = input<CarouselItem[]>([]);
  autoplay = input<boolean>(false);
  autoplayInterval = input<number>(5000);
  infinite = input<boolean>(true);
  showArrows = input<boolean>(true);
  showIndicators = input<boolean>(true);
  aspectRatio = input<'16:9' | '4:3' | '1:1' | 'auto'>('16:9');
  ariaLabel = input<string>();
  
  onSlideChange = output<{ index: number; item: CarouselItem }>();
  
  currentIndex = signal(0);
  private autoplayTimer: number | null = null;

  constructor() {
    // Auto-advance slides if autoplay is enabled
    effect(() => {
      if (this.autoplay() && this.items().length > 1) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    });

    // Reset to first slide when items change
    effect(() => {
      if (this.items().length > 0 && this.currentIndex() >= this.items().length) {
        this.currentIndex.set(0);
      }
    });
  }

  containerClasses = computed(() => [
    'ui-carousel',
    {
      'select-none': true
    }
  ]);

  imageClasses = computed(() => [
    'w-full object-cover',
    {
      'aspect-video': this.aspectRatio() === '16:9',
      'aspect-[4/3]': this.aspectRatio() === '4:3',
      'aspect-square': this.aspectRatio() === '1:1',
      'h-auto': this.aspectRatio() === 'auto'
    }
  ]);

  contentClasses = computed(() => [
    'p-8 bg-white dark:bg-gray-800 min-h-[300px] flex flex-col justify-center',
    {
      'aspect-video': this.aspectRatio() === '16:9',
      'aspect-[4/3]': this.aspectRatio() === '4:3',
      'aspect-square': this.aspectRatio() === '1:1'
    }
  ]);

  next() {
    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= this.items().length) {
      if (this.infinite()) {
        this.goToSlide(0);
      }
    } else {
      this.goToSlide(nextIndex);
    }
  }

  previous() {
    const prevIndex = this.currentIndex() - 1;
    if (prevIndex < 0) {
      if (this.infinite()) {
        this.goToSlide(this.items().length - 1);
      }
    } else {
      this.goToSlide(prevIndex);
    }
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.items().length) {
      this.currentIndex.set(index);
      const item = this.items()[index];
      this.onSlideChange.emit({ index, item });
    }
  }

  private startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => {
      this.next();
    }, this.autoplayInterval());
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }
}