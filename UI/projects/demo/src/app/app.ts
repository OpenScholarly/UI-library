import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { 
  ButtonComponent, 
  CardComponent, 
  AccordionComponent, 
  FooterComponent,
  type AccordionItem,
  type FooterSection,
  type FooterLink
} from 'ui-components';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ButtonComponent, 
    CardComponent, 
    AccordionComponent, 
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('UI Library Demo');

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

  // Demo data for footer
  protected footerSections = signal<FooterSection[]>([
    {
      title: 'Components',
      links: [
        { label: 'Button', href: '#button' },
        { label: 'Card', href: '#card' },
        { label: 'Accordion', href: '#accordion' },
        { label: 'Footer', href: '#footer' }
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

  protected onButtonClick(): void {
    console.log('Button clicked!');
  }

  protected onAccordionToggle(event: { id: string; expanded: boolean }): void {
    console.log('Accordion toggled:', event);
  }
}
