import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FooterLink, FooterSection } from '../../../types';

@Component({
  selector: 'ui-footer',
  standalone: true,
  template: `
    <footer [class]="footerClasses()" role="contentinfo">
      <div [class]="containerClasses()">

        <!-- Main content -->
        @if (sections().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            @for (section of sections(); track section.title) {
              <div class="space-y-4">
                <h3 class="font-semibold text-text-primary text-sm uppercase tracking-wide">
                  {{ section.title }}
                </h3>
                <ul class="space-y-2">
                  @for (link of section.links; track link.href) {
                    <li>
                      <a
                        [href]="link.href"
                        [target]="link.external ? '_blank' : undefined"
                        [rel]="link.external ? 'noopener noreferrer' : undefined"
                        class="text-text-secondary hover:text-text-primary ui-transition-fast text-sm"
                        [class.flex]="link.external"
                        [class.items-center]="link.external"
                        [class.gap-1]="link.external">
                        {{ link.label }}
                        @if (link.external) {
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                        }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        }

        <!-- Custom content slot -->
        <div class="mb-8">
          <ng-content />
        </div>

        <!-- Bottom bar -->
        <div [class]="bottomBarClasses()">
          @if (copyright()) {
            <p class="text-text-secondary text-sm">
              {{ copyright() }}
            </p>
          }

          @if (socialLinks().length > 0) {
            <div class="flex space-x-4">
              @for (social of socialLinks(); track social.href) {
                <a
                  [href]="social.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="social.label"
                  class="text-text-secondary hover:text-text-primary ui-transition-fast">
                  <span class="sr-only">{{ social.label }}</span>
                  <!-- You would typically use an icon component here -->
                  <span class="w-5 h-5 inline-block">{{ social.label.charAt(0) }}</span>
                </a>
              }
            </div>
          }
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  sections = input<FooterSection[]>([]);
  copyright = input<string>('');
  socialLinks = input<FooterLink[]>([]);
  variant = input<'default' | 'dark' | 'minimal'>('default');
  fluid = input(false);

  protected footerClasses = computed(() => {
    const baseClasses = 'ui-footer';

    const variants = {
      default: 'bg-surface border-t border-gray-200',
      dark: 'bg-gray-900 text-white',
      minimal: 'bg-transparent'
    };

    return `${baseClasses} ${variants[this.variant()]}`;
  });

  protected containerClasses = computed(() => {
    const baseClasses = 'py-12';
    const containerClasses = this.fluid() ? 'px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    return `${baseClasses} ${containerClasses}`;
  });

  protected bottomBarClasses = computed(() => {
    const baseClasses = 'pt-8 border-t border-gray-200';
    const layoutClasses = 'flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0';

    return `${baseClasses} ${layoutClasses}`;
  });
}
