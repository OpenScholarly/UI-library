import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
  InputComponent, BadgeComponent, ModalComponent,
  TooltipComponent, CheckboxComponent, RadioGroupComponent, SelectComponent,
  ToggleComponent, LoaderComponent, ProgressComponent,
  BreadcrumbsComponent, PaginationComponent, TextareaComponent,
  ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent,
  ContainerComponent, GridComponent, DividerComponent,
  HeadingComponent, TextComponent, IconComponent, LinkComponent, ImageComponent, ScrollAreaComponent,
  IconButtonComponent, ButtonGroupComponent, FabComponent,
  SegmentedButtonComponent, SplitButtonComponent, AutocompleteComponent, SearchComponent, MenuComponent, SkeletonComponent,
  ThemeSwitcherComponent, CommandMenuComponent, TreeViewComponent, ThemeSelectorComponent,
  AlertComponent, EmptyStateComponent, RatingComponent, AvatarGroupComponent,
  type AccordionItem, type FooterSection, type TabItem, type SelectOption, type BreadcrumbItem,
  type SegmentedButtonOption, type SplitButtonAction, type AutocompleteOption, type SearchResult, type NavigationItem,
  type TableColumn, type MenuItem, type ThemeMode, type FeedItem, type StatItem, type TimelineItem,
  type BannerAction, type CarouselItem, type NavbarItem, type CommandItem, type TreeNode, type RadioOption,
  ThemeService
} from 'ui-components';

@Component({
  selector: 'app-main',
  imports: [
    ReactiveFormsModule,
    ButtonComponent, CardComponent, AccordionComponent, FooterComponent,
    InputComponent, BadgeComponent, ModalComponent,
    TooltipComponent, CheckboxComponent, RadioGroupComponent, SelectComponent,
    ToggleComponent, LoaderComponent, ProgressComponent,
    BreadcrumbsComponent, PaginationComponent, TextareaComponent,
    ChipComponent, ToastComponent, SliderComponent, AvatarComponent, TabsComponent,
    ContainerComponent, GridComponent, DividerComponent,
    HeadingComponent, TextComponent, IconComponent, LinkComponent, ImageComponent, ScrollAreaComponent,
    IconButtonComponent, ButtonGroupComponent, FabComponent,
    SegmentedButtonComponent, SplitButtonComponent, AutocompleteComponent, SearchComponent, MenuComponent, SkeletonComponent, 
    ThemeSwitcherComponent, CommandMenuComponent, TreeViewComponent, ThemeSelectorComponent,
    AlertComponent, EmptyStateComponent, RatingComponent, AvatarGroupComponent
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {
  private themeService = inject(ThemeService);
  title = signal('UI Component Library - 50+ Components Demo');

  // Component states
  isModalOpen = signal(false);
  currentPage = signal(1);
  progressValue = signal(45);
  showToast = signal(false);
  sliderValue = signal(50);
  isCommandMenuOpen = signal(false);

  // NEW COMPONENT DATA
  // Feed data
  feedItems = signal<FeedItem[]>([
    {
      id: '1',
      author: { name: 'John Doe', username: 'johndoe', avatar: '' },
      content: 'Just shipped a new feature! 🚀 The new component library is looking amazing.',
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: true
    },
    {
      id: '2',
      author: { name: 'Jane Smith', username: 'janesmith' },
      content: 'Working on some exciting new designs. Can\'t wait to share them with the team!\n\nWhat do you think about dark mode support?',
      timestamp: new Date(Date.now() - 7200000),
      likes: 12,
      comments: 5,
      images: ['https://picsum.photos/400/300?random=1']
    }
  ]);

  // Stats data
  statsItems = signal<StatItem[]>([
    {
      label: 'Total Components',
      value: 50,
      icon: '🧩',
      change: { value: 25, type: 'increase', period: 'this month' }
    },
    {
      label: 'GitHub Stars',
      value: 1248,
      icon: '⭐',
      change: { value: 12, type: 'increase', period: 'this week' }
    },
    {
      label: 'Downloads',
      value: 15420,
      icon: '📥',
      change: { value: 8, type: 'increase', period: 'this month' }
    },
    {
      label: 'Bundle Size',
      value: '24KB',
      icon: '📦',
      change: { value: 3, type: 'decrease', period: 'optimized' }
    }
  ]);

  // Timeline data
  timelineItems = signal<TimelineItem[]>([
    {
      id: '1',
      title: 'Component Library Launch',
      description: 'Released the initial version with 22 components',
      timestamp: new Date(Date.now() - 86400000),
      status: 'completed',
      icon: '🚀',
      user: { name: 'Development Team' }
    },
    {
      id: '2',
      title: 'Dark Mode Support Added',
      description: 'Implemented comprehensive dark mode theming',
      timestamp: new Date(Date.now() - 43200000),
      status: 'completed',
      icon: '🌙'
    },
    {
      id: '3',
      title: 'Advanced Components',
      description: 'Working on Feed, Stats, Timeline, and Navigation components',
      timestamp: new Date(),
      status: 'active',
      icon: '⚡'
    }
  ]);

  // Banner actions
  bannerActions = signal<BannerAction[]>([
    { label: 'Get Started', variant: 'primary' },
    { label: 'Learn More', variant: 'secondary' }
  ]);

  // Carousel data
  carouselItems = signal<CarouselItem[]>([
    {
      id: '1',
      title: 'Welcome to Our Component Library',
      description: 'Build beautiful applications with our production-ready components',
      image: 'https://picsum.photos/800/400?random=1'
    },
    {
      id: '2',
      title: 'Dark Mode Support',
      description: 'All components work seamlessly in both light and dark themes',
      image: 'https://picsum.photos/800/400?random=2'
    },
    {
      id: '3',
      title: 'Accessibility First',
      description: 'WCAG 2.1 AA compliant with keyboard navigation and screen reader support',
      image: 'https://picsum.photos/800/400?random=3'
    }
  ]);

  // Navbar data
  navbarItems = signal<NavbarItem[]>([
    { id: '1', label: 'Home', icon: '🏠', active: true },
    { id: '2', label: 'Components', icon: '🧩', badge: 50 },
    {
      id: '3',
      label: 'Resources',
      icon: '📚',
      children: [
        { id: '3-1', label: 'Documentation', icon: '📖' },
        { id: '3-2', label: 'Examples', icon: '💡' },
        { id: '3-3', label: 'GitHub', icon: '👨‍💻' }
      ]
    }
  ]);

  // Command menu data
  commandItems = signal<CommandItem[]>([
    { id: '1', label: 'Search Components', description: 'Find any component quickly', icon: '🔍', group: 'Navigation', shortcut: 'Ctrl+K' },
    { id: '2', label: 'Toggle Theme', description: 'Switch between light and dark mode', icon: '🌙', group: 'Settings', shortcut: 'Ctrl+T' },
    { id: '3', label: 'Copy Component', description: 'Copy component code to clipboard', icon: '📋', group: 'Actions', shortcut: 'Ctrl+C' },
    { id: '4', label: 'Open GitHub', description: 'View source code on GitHub', icon: '👨‍💻', group: 'External', shortcut: 'Ctrl+G' }
  ]);

  // Tree view data
  treeNodes = signal<TreeNode[]>([
    {
      id: '1',
      label: 'Components',
      icon: '📁',
      expanded: true,
      children: [
        {
          id: '1-1',
          label: 'Layout',
          icon: '📁',
          children: [
            { id: '1-1-1', label: 'Container', icon: '📄' },
            { id: '1-1-2', label: 'Grid', icon: '📄' },
            { id: '1-1-3', label: 'Row', icon: '📄' },
            { id: '1-1-4', label: 'Column', icon: '📄' }
          ]
        },
        {
          id: '1-2',
          label: 'Navigation',
          icon: '📁',
          expanded: true,
          children: [
            { id: '1-2-1', label: 'Navbar', icon: '📄', selected: true },
            { id: '1-2-2', label: 'Breadcrumbs', icon: '📄' },
            { id: '1-2-3', label: 'Tabs', icon: '📄' }
          ]
        }
      ]
    },
    {
      id: '2',
      label: 'Examples',
      icon: '📁',
      children: [
        { id: '2-1', label: 'Basic Usage', icon: '📄' },
        { id: '2-2', label: 'Advanced', icon: '📄' }
      ]
    }
  ]);

  // Form data
  selectOptions = signal<SelectOption[]>([
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' }
  ]);

  radioOptions = signal<RadioOption[]>([
    { value: 'poor', label: 'Poor', description: 'Needs significant improvement' },
    { value: 'fair', label: 'Fair', description: 'Could be better' },
    { value: 'good', label: 'Good', description: 'Meets expectations' },
    { value: 'excellent', label: 'Excellent', description: 'Exceeds expectations' }
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
      title: 'Product',
      links: [
        { label: 'Components', href: '#' },
        { label: 'Pricing', href: '#' },
      ]
    }, {
      title: 'Company', links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    }, {
      title: 'Resources', links: [
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
    { id: 'list', value: 'list', label: 'List View', icon: '📋' },
    { id: 'grid', value: 'grid', label: 'Grid View', icon: '⊞' },
    { id: 'card', value: 'card', label: 'Card View', icon: '📃' }
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

  onRadioGroupChange(value: string | number) {
    console.log('Radio group value changed to:', value);
  }

  // NEW COMPONENT EVENT HANDLERS
  // Feed handlers
  onFeedLike(itemId: string) {
    console.log('Liked item:', itemId);
    this.feedItems.update(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, isLiked: !item.isLiked, likes: (item.likes || 0) + (item.isLiked ? -1 : 1) }
          : item
      )
    );
  }

  onFeedComment(itemId: string) {
    console.log('Comment on item:', itemId);
  }

  onFeedShare(itemId: string) {
    console.log('Share item:', itemId);
  }

  onFeedBookmark(itemId: string) {
    console.log('Bookmark item:', itemId);
    this.feedItems.update(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );
  }

  // Timeline handlers
  onTimelineItemClick(itemId: string) {
    console.log('Timeline item clicked:', itemId);
  }

  // Banner handlers
  onBannerAction(action: BannerAction) {
    console.log('Banner action:', action.label);
  }

  onBannerDismiss() {
    console.log('Banner dismissed');
  }

  // Carousel handlers
  onCarouselSlideChange(event: { index: number; item: CarouselItem }) {
    console.log('Carousel slide changed:', event);
  }

  // Navbar handlers
  onNavbarItemClick(item: NavbarItem) {
    console.log('Navbar item clicked:', item.label);
  }

  // Command menu handlers
  openCommandMenu() {
    this.isCommandMenuOpen.set(true);
  }

  closeCommandMenu() {
    this.isCommandMenuOpen.set(false);
  }

  onCommandSelect(item: CommandItem) {
    console.log('Command selected:', item.label);
    // Handle specific commands
    switch (item.id) {
      case '2': // Toggle Theme
        // This would integrate with your theme service
        break;
      case '4': // Open GitHub
        window.open('https://github.com', '_blank');
        break;
    }
  }

  // Tree view handlers
  onTreeNodeClick(node: TreeNode) {
    console.log('Tree node clicked:', node.label);
  }

  onTreeNodeSelect(event: { node: TreeNode; selected: boolean }) {
    console.log('Tree node selected:', event.node.label, event.selected);
  }

  // NEW COMPONENTS DATA
  // Rating component
  ratingValue = signal(4);
  
  onRatingChange(value: number) {
    this.ratingValue.set(value);
    console.log('Rating changed to:', value);
  }

  // Avatar group data
  avatarGroupMembers = signal([
    { name: 'John Doe', src: '', status: 'online' as const },
    { name: 'Jane Smith', src: '', status: 'away' as const },
    { name: 'Bob Johnson', src: '' },
    { name: 'Alice Brown', src: '', status: 'busy' as const },
    { name: 'Charlie Wilson', src: '' },
  ]);

  // Alert data
  showAlert = signal(true);
  
  onAlertDismissed() {
    this.showAlert.set(false);
  }

  onAlertAction() {
    console.log('Alert action clicked');
  }

  // Empty state
  showEmptyState = signal(false);
  
  onCreateItem() {
    console.log('Create new item');
    this.showEmptyState.set(false);
  }
}
