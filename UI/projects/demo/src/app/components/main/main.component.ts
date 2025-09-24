import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
  InputComponent, BadgeComponent, ModalComponent, 
  TooltipComponent, CheckboxComponent, SelectComponent,
  ToggleComponent, LoaderComponent, ProgressComponent,
  BreadcrumbsComponent, PaginationComponent, TextareaComponent,
  ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent,
  type AccordionItem, type FooterSection, type TabItem, type SelectOption, type BreadcrumbItem
} from 'ui-components';

@Component({
  selector: 'app-main',
  imports: [
    ReactiveFormsModule,
    ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
    InputComponent, BadgeComponent, ModalComponent, 
    TooltipComponent, CheckboxComponent, SelectComponent,
    ToggleComponent, LoaderComponent, ProgressComponent,
    BreadcrumbsComponent, PaginationComponent, TextareaComponent,
    ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {
  protected title = signal('UI Component Library - 22+ Components Demo');

  // Component states
  isModalOpen = signal(false);
  currentPage = signal(1);
  progressValue = signal(45);
  showToast = signal(false);
  sliderValue = signal(50);

  // Form data
  selectOptions = signal<SelectOption[]>([
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' }
  ]);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Demo' }
  ]);

  tabItems = signal<TabItem[]>([
    {
      id: 'overview',
      label: 'Overview',
      content: 'Component library overview and features.',
      icon: '📋'
    },
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
    }
  ]);

  accordionItems = signal<AccordionItem[]>([
    {
      id: 'design-tokens',
      title: 'Design Tokens System',
      content: 'Comprehensive design token system with CSS custom properties supporting colors, spacing, typography, motion, and dark theme.'
    },
    {
      id: 'components',
      title: '22+ Production-Ready Components',
      content: 'Complete component library with form controls, navigation, feedback, display, and overlay components. All components are fully accessible and follow WCAG 2.1 AA standards.'
    },
    {
      id: 'utilities',
      title: 'Utility Services',
      content: 'Focus trap, ARIA helpers, portal, positioning, and dismiss services for building complex UI interactions.'
    }
  ]);

  footerSections = signal<FooterSection[]>([
    {
      title: 'Components',
      links: [
        { label: 'Buttons', href: '#' },
        { label: 'Forms', href: '#' },
        { label: 'Navigation', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Examples', href: '#' },
        { label: 'GitHub', href: '#' }
      ]
    }
  ]);

  // Methods
  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onSliderChange(value: number) {
    this.sliderValue.set(value);
  }

  onTabChange(tabId: string) {
    console.log('Tab changed to:', tabId);
  }

  showToastNotification() {
    this.showToast.set(true);
    // Auto hide after 5 seconds
    setTimeout(() => this.showToast.set(false), 5000);
  }

  onToastDismiss() {
    this.showToast.set(false);
  }
}
