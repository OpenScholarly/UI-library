import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { 
  ButtonComponent, 
  CardComponent, 
  AccordionComponent, 
  FooterComponent,
  InputComponent,
  BadgeComponent,
  AvatarComponent,
  ModalComponent,
  TooltipComponent,
  TabsComponent,
  type AccordionItem,
  type FooterSection,
  type FooterLink,
  type TabItem
} from '../../../../../ui-components/src/public-api';
// from 'ui-components';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, CardComponent, AccordionComponent, FooterComponent, InputComponent, BadgeComponent, AvatarComponent, ModalComponent, TooltipComponent, TabsComponent],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  protected title = signal('UI Component Library');
  protected lastClicked = signal<string | null>(null);

  // Demo state
  protected modalOpen = signal(false);

  // Demo data for accordion
  protected accordionItems = signal<AccordionItem[]>([
    {
      id: 'design-tokens',
      title: 'Design Tokens',
      content: 'Design tokens provide a consistent foundation with colors, spacing, typography, and motion values across all components.'
    },
    {
      id: 'accessibility',
      title: 'Accessibility Features',
      content: 'Built-in focus management, screen reader support, and ARIA attributes ensure components meet WCAG 2.1 AA standards.'
    },
    {
      id: 'glass-effects',
      title: 'Glass & Liquid Effects',
      content: 'Modern glass morphism effects with backdrop blur and transparency for beautiful, modern interfaces.'
    }
  ]);

  // Demo data for tabs
  protected tabItems = signal<TabItem[]>([
    {
      id: 'components',
      label: 'Components',
      content: 'All UI components with consistent design and accessibility features.',
      icon: '🧩'
    },
    {
      id: 'utilities',
      label: 'Utilities',
      content: 'Powerful utility services for focus management, positioning, and ARIA helpers.',
      icon: '🛠️'
    },
    {
      id: 'tokens',
      label: 'Design Tokens',
      content: 'Comprehensive design token system with colors, spacing, motion, and typography.',
      icon: '🎨'
    }
  ]);

  // Demo data for footer
  protected footerSections = signal<FooterSection[]>([
    {
      title: 'Components',
      links: [
        { label: 'Button', href: '#button' },
        { label: 'Card', href: '#card' },
        { label: 'Input', href: '#input' },
        { label: 'Modal', href: '#modal' },
        { label: 'Tabs', href: '#tabs' }
      ]
    },
    {
      title: 'Utilities',
      links: [
        { label: 'Focus Trap', href: '#focus-trap' },
        { label: 'Portal Service', href: '#portal' },
        { label: 'Positioning', href: '#positioning' },
        { label: 'ARIA Helpers', href: '#aria' }
      ]
    }
  ]);

  protected socialLinks = signal<FooterLink[]>([
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Twitter', href: 'https://twitter.com', external: true }
  ]);

  protected onButtonClick(buttonName: string): void {
    this.lastClicked.set(buttonName);
    console.log(`${buttonName} button clicked`);
  }

  protected onAccordionToggle(event: { id: string; expanded: boolean }): void {
    console.log('Accordion toggled:', event);
  }

  protected openModal(): void {
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
  }

  protected onTabChange(tabId: string): void {
    console.log('Tab changed to:', tabId);
  }

  protected onBadgeDismiss(): void {
    console.log('Badge dismissed');
  }
}
