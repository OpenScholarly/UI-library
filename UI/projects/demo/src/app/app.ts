import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
  InputComponent, BadgeComponent, ModalComponent, 
  TooltipComponent, CheckboxComponent,
  ToggleComponent, LoaderComponent, ProgressComponent,
  BreadcrumbsComponent, PaginationComponent,
  ChipComponent, ToastComponent
} from 'ui-components';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
    InputComponent, BadgeComponent, ModalComponent, 
    TooltipComponent, CheckboxComponent,
    ToggleComponent, LoaderComponent, ProgressComponent,
    BreadcrumbsComponent, PaginationComponent,
    ChipComponent, ToastComponent
  ],
  templateUrl: './app.html',
})
export class App {
  protected title = signal('UI Component Library - 22+ Components Demo');

  // Component states
  isModalOpen = signal(false);
  currentPage = signal(1);
  progressValue = signal(45);
  showToast = signal(false);

  accordionItems = [
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
  ];

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

  showToastNotification() {
    this.showToast.set(true);
    // Auto hide after 5 seconds
    setTimeout(() => this.showToast.set(false), 5000);
  }

  onToastDismiss() {
    this.showToast.set(false);
  }
}
