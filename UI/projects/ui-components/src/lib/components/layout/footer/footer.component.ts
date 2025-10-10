import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FooterLink, FooterSection } from '../../../types';

/**
 * A versatile footer component for site-wide navigation and information.
 *
 * ## Features
 * - Multiple column layout with link sections
 * - Copyright and social media links support
 * - Content projection for custom footer content
 * - Multiple visual variants (default, dark, minimal)
 * - Responsive grid layout (1-4 columns)
 * - External link indicators with security defaults
 * - Full-width or contained layouts
 * - WCAG 2.1 Level AA accessibility
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic footer with sections -->
 * <ui-footer
 *   [sections]="footerSections"
 *   copyright="© 2024 Company Name. All rights reserved."
 *   [socialLinks]="socialLinks">
 * </ui-footer>
 *
 * <!-- Dark variant footer -->
 * <ui-footer
 *   variant="dark"
 *   [sections]="linkSections"
 *   copyright="© 2024 Brand">
 * </ui-footer>
 *
 * <!-- Minimal footer with custom content -->
 * <ui-footer variant="minimal" copyright="© 2024 Company">
 *   <div class="flex justify-center gap-4">
 *     <a href="/privacy">Privacy</a>
 *     <a href="/terms">Terms</a>
 *   </div>
 * </ui-footer>
 *
 * <!-- Full-width fluid footer -->
 * <ui-footer
 *   [fluid]="true"
 *   [sections]="sections"
 *   [socialLinks]="socials">
 * </ui-footer>
 * ```
 */
@Component({
  selector: 'ui-footer',
  standalone: true,
  host: {
    'class': 'block w-full'
  },
  template: `
    <footer [class]="footerClasses()" role="contentinfo">
      <div [class]="containerClasses()">

        <!-- Main content -->
        @if (sections().length > 0) {
          <div class=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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
  /**
   * Array of footer sections with links organized by category.
   * Each section has a title and array of links.
   * @default []
   * @example [{ title: 'Product', links: [{ label: 'Features', href: '/features' }] }]
   */
  sections = input<FooterSection[]>([]);
  
  /**
   * Copyright text displayed in the footer bottom bar.
   * @default ""
   * @example "© 2024 Company Name. All rights reserved."
   */
  copyright = input<string>('');
  
  /**
   * Social media links displayed in the footer bottom bar.
   * Each link should have a label for accessibility.
   * @default []
   * @example [{ label: 'Twitter', href: 'https://twitter.com/company' }]
   */
  socialLinks = input<FooterLink[]>([]);
  
  /**
   * Visual style variant of the footer.
   * - `default`: Light background with border
   * - `dark`: Dark background with white text
   * - `minimal`: Transparent background
   * @default "default"
   */
  variant = input<'default' | 'dark' | 'minimal'>('default');
  
  /**
   * Whether the footer should span full width without max-width constraint.
   * @default false
   */
  fluid = input(false);

  protected footerClasses = computed(() => {
    const baseClasses = 'ui-footer w-full';

    const variants = {
      default: 'bg-surface border-t border-gray-200',
      dark: 'bg-gray-900 text-white',
      minimal: 'bg-transparent'
    };

    return `${baseClasses} ${variants[this.variant()]}`;
  });

  protected containerClasses = computed(() => {
    const baseClasses = 'pt-12 pb-3 w-full';
    const containerClasses = this.fluid() ? 'px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    return `${baseClasses} ${containerClasses}`;
  });

  protected bottomBarClasses = computed(() => {
    const baseClasses = 'pt-8 border-t border-gray-200';
    const layoutClasses = 'flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0';

    return `${baseClasses} ${layoutClasses}`;
  });
}
