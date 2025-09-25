import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
  InputComponent, BadgeComponent, ModalComponent, 
  TooltipComponent, CheckboxComponent, SelectComponent,
  ToggleComponent, LoaderComponent, ProgressComponent,
  BreadcrumbsComponent, PaginationComponent, TextareaComponent,
  ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent,
  ContainerComponent, GridComponent, RowComponent, ColumnComponent, DividerComponent,
  HeadingComponent, TextComponent, IconComponent, LinkComponent, ImageComponent, ScrollAreaComponent,
  IconButtonComponent, ButtonGroupComponent, FabComponent,
  SegmentedButtonComponent, SplitButtonComponent, AutocompleteComponent, SearchComponent, LayoutComponent,
  TableComponent, MenuComponent, SkeletonComponent, ThemeSwitcherComponent,
  type AccordionItem, type FooterSection, type TabItem, type SelectOption, type BreadcrumbItem,
  type SegmentedButtonOption, type SplitButtonAction, type AutocompleteOption, type SearchResult, type NavigationItem,
  type TableColumn, type MenuItem, type ThemeMode
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
    ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent,
    ContainerComponent, GridComponent, RowComponent, ColumnComponent, DividerComponent,
    HeadingComponent, TextComponent, IconComponent, LinkComponent, ImageComponent, ScrollAreaComponent,
    IconButtonComponent, ButtonGroupComponent, FabComponent,
    SegmentedButtonComponent, SplitButtonComponent, AutocompleteComponent, SearchComponent, LayoutComponent,
    TableComponent, MenuComponent, SkeletonComponent, ThemeSwitcherComponent
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

  // New components data
  segmentedOptions = signal<SegmentedButtonOption[]>([
    { value: 'list', label: 'List View', icon: '📋' },
    { value: 'grid', label: 'Grid View', icon: '⊞' },
    { value: 'card', label: 'Card View', icon: '📃' }
  ]);

  splitButtonActions = signal<SplitButtonAction[]>([
    { value: 'save-as', label: 'Save As...', icon: '💾' },
    { value: 'export', label: 'Export', icon: '📤' },
    { value: 'share', label: 'Share', icon: '🔗' }
  ]);

  autocompleteOptions = signal<AutocompleteOption[]>([
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'next', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt.js' }
  ]);

  searchResults = signal<SearchResult[]>([]);

  navigationItems = signal<NavigationItem[]>([
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '#' },
    { id: 'components', label: 'Components', icon: '🧩', href: '#', badge: '42' },
    { id: 'docs', label: 'Documentation', icon: '📚', href: '#' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '#' }
  ]);

  // Table data
  tableColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'lastLogin', label: 'Last Login', sortable: true, align: 'right' }
  ]);

  tableData = signal([
    { id: 1, name: 'John Doe', role: 'Admin', status: '🟢 Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', role: 'Editor', status: '🟢 Active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', role: 'Viewer', status: '🟡 Pending', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Brown', role: 'Editor', status: '🔴 Inactive', lastLogin: '2024-01-05' }
  ]);

  // Menu data
  menuItems = signal<MenuItem[]>([
    { id: 'edit', label: 'Edit', icon: '✏️' },
    { id: 'copy', label: 'Copy', icon: '📋' },
    { id: 'separator1', label: '', separator: true },
    { 
      id: 'share', 
      label: 'Share', 
      icon: '🔗',
      children: [
        { id: 'email', label: 'Email', icon: '📧' },
        { id: 'social', label: 'Social Media', icon: '📱' },
        { id: 'link', label: 'Copy Link', icon: '🔗' }
      ]
    },
    { id: 'separator2', label: '', separator: true },
    { id: 'delete', label: 'Delete', icon: '🗑️' }
  ]);

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

  onSegmentedChange(value: string) {
    console.log('Segmented button changed to:', value);
  }

  onSplitButtonAction() {
    console.log('Split button main action clicked');
  }

  onSplitButtonActionSelected(action: SplitButtonAction) {
    console.log('Split button action selected:', action);
  }

  onAutocompleteChange(value: string) {
    console.log('Autocomplete changed to:', value);
  }

  onSearchChange(term: string) {
    // Simulate search API call
    if (term.length > 2) {
      const mockResults: SearchResult[] = [
        { id: '1', title: `Results for "${term}"`, description: 'Sample search result', category: 'Component' },
        { id: '2', title: `${term} Documentation`, description: 'Related documentation', category: 'Docs' },
        { id: '3', title: `${term} Examples`, description: 'Code examples and tutorials', category: 'Examples' }
      ];
      this.searchResults.set(mockResults);
    } else {
      this.searchResults.set([]);
    }
  }

  onSearchResultSelected(result: SearchResult) {
    console.log('Search result selected:', result);
  }

  onNavItemClicked(item: NavigationItem) {
    console.log('Navigation item clicked:', item);
  }

  onTableRowClicked(event: { row: any; index: number }) {
    console.log('Table row clicked:', event);
  }

  onTableSortChanged(event: { column: string; direction: any }) {
    console.log('Table sort changed:', event);
  }

  onMenuItemSelected(item: MenuItem) {
    console.log('Menu item selected:', item);
  }

  onThemeChanged(theme: ThemeMode) {
    console.log('Theme changed to:', theme);
  }
}
