import { Component, signal } from '@angular/core';
import {
  TableComponent, MenuComponent, SkeletonComponent, DividerComponent, CardComponent, HeadingComponent, TextComponent, ButtonComponent, TreeViewComponent, NavbarComponent, FeedComponent, StatsComponent, TimelineComponent, BannerComponent, CarouselComponent, FooterComponent, ModalComponent, ToastComponent, CommandMenuComponent,
  DatePickerComponent, TimePickerComponent, NavigationRailComponent, BottomSheetComponent, ActionSheetComponent, InputComponent, BadgeComponent,
  FooterSection, NavigationRailItem, ActionSheetAction
} from 'ui-components';

@Component({
  selector: 'app-big-features',
  standalone: true,
  imports: [
    TableComponent, CardComponent, HeadingComponent, TextComponent, ButtonComponent, NavbarComponent, FeedComponent, StatsComponent, TimelineComponent, BannerComponent, CarouselComponent, FooterComponent, ModalComponent, ToastComponent, CommandMenuComponent,
    DatePickerComponent, TimePickerComponent, NavigationRailComponent, BottomSheetComponent, ActionSheetComponent, InputComponent, BadgeComponent
  ],
  templateUrl: './big-features.components.html',
})
export class BigFeaturesComponent {
  // Table
  tableColumns = signal([
    { key: 'name' as const, label: 'Name', sortable: true },
    { key: 'role' as const, label: 'Role', sortable: true },
    { key: 'status' as const, label: 'Status', align: 'center' as const },
    { key: 'lastLogin' as const, label: 'Last Login', sortable: true, align: 'right' as const }
  ]);
  tableData = signal([
    { id: 1, name: 'John Doe', role: 'Admin', status: '🟢 Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', role: 'Editor', status: '🟢 Active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', role: 'Viewer', status: '🟡 Pending', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Brown', role: 'Editor', status: '🔴 Inactive', lastLogin: '2024-01-05' }
  ]);
  onTableRowClicked(event: { row: any; index: number }) { console.log('Table row clicked:', event); }
  onTableSortChanged(event: { column: string; direction: any }) { console.log('Table sort changed:', event); }

  // Menu
  menuItems = signal([
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
  onMenuItemSelected(item: any) { console.log('Menu item selected:', item); }

  // Skeleton: no state needed

  // Feed
  feedItems = signal([
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
  onFeedLike(itemId: string) { console.log('Liked item:', itemId); }
  onFeedComment(itemId: string) { console.log('Comment on item:', itemId); }
  onFeedShare(itemId: string) { console.log('Share item:', itemId); }
  onFeedBookmark(itemId: string) { console.log('Bookmark item:', itemId); }

  // Stats
  statsItems = signal([
    { label: 'Total Components', value: 50, icon: '🧩', change: { value: 25, type: 'increase' as const, period: 'this month' } },
    { label: 'GitHub Stars', value: 1248, icon: '⭐', change: { value: 12, type: 'increase' as const, period: 'this week' } },
    { label: 'Downloads', value: 15420, icon: '📥', change: { value: 8, type: 'increase' as const, period: 'this month' } },
    { label: 'Bundle Size', value: '24KB', icon: '📦', change: { value: 3, type: 'decrease' as const, period: 'optimized' } }
  ]);

  // Timeline
  timelineItems = signal([
    { id: '1', title: 'Component Library Launch', description: 'Released the initial version with 22 components', timestamp: new Date(Date.now() - 86400000), status: 'completed' as const, icon: '🚀', user: { name: 'Development Team' } },
    { id: '2', title: 'Dark Mode Support Added', description: 'Implemented comprehensive dark mode theming', timestamp: new Date(Date.now() - 43200000), status: 'completed' as const, icon: '🌙' },
    { id: '3', title: 'Advanced Components', description: 'Working on Feed, Stats, Timeline, and Navigation components', timestamp: new Date(), status: 'active' as const, icon: '⚡' }
  ]);
  onTimelineItemClick(itemId: string) { console.log('Timeline item clicked:', itemId); }

  // Banner
  bannerActions = signal([
    { label: 'Get Started', variant: 'primary' as const },
    { label: 'Learn More', variant: 'secondary' as const }
  ]);
  onBannerAction(action: any) { console.log('Banner action:', action.label); }
  onBannerDismiss() { console.log('Banner dismissed'); }

  // Carousel
  carouselItems = signal([
    { id: '1', title: 'Welcome to Our Component Library', description: 'Build beautiful applications with our production-ready components', image: 'https://picsum.photos/800/400?random=1' },
    { id: '2', title: 'Dark Mode Support', description: 'All components work seamlessly in both light and dark themes', image: 'https://picsum.photos/800/400?random=2' },
    { id: '3', title: 'Accessibility First', description: 'WCAG 2.1 AA compliant with keyboard navigation and screen reader support', image: 'https://picsum.photos/800/400?random=3' }
  ]);
  onCarouselSlideChange(event: { index: number; item: any }) { console.log('Carousel slide changed:', event); }

  // Navbar
  navbarItems = signal([
    { id: '1', label: 'Home', icon: '🏠', active: true },
    { id: '2', label: 'Components', icon: '🧩', badge: 50 },
    { id: '3', label: 'Resources', icon: '📚', children: [ { id: '3-1', label: 'Documentation', icon: '📖' }, { id: '3-2', label: 'Examples', icon: '💡' }, { id: '3-3', label: 'GitHub', icon: '👨‍💻' } ] }
  ]);
  onNavbarItemClick(item: any) { console.log('Navbar item clicked:', item.label); }

  // TreeView
  treeNodes = signal([
    { id: '1', label: 'Components', icon: '📁', expanded: true, children: [ { id: '1-1', label: 'Layout', icon: '📁', children: [ { id: '1-1-1', label: 'Container', icon: '📄' }, { id: '1-1-2', label: 'Grid', icon: '📄' }, { id: '1-1-3', label: 'Row', icon: '📄' }, { id: '1-1-4', label: 'Column', icon: '📄' } ] }, { id: '1-2', label: 'Navigation', icon: '📁', expanded: true, children: [ { id: '1-2-1', label: 'Navbar', icon: '📄', selected: true }, { id: '1-2-2', label: 'Breadcrumbs', icon: '📄' }, { id: '1-2-3', label: 'Tabs', icon: '📄' } ] } ] }, { id: '2', label: 'Examples', icon: '📁', children: [ { id: '2-1', label: 'Basic Usage', icon: '📄' }, { id: '2-2', label: 'Advanced', icon: '📄' } ] }
  ]);
  onTreeNodeClick(node: any) { console.log('Tree node clicked:', node.label); }
  onTreeNodeSelect(event: { node: any; selected: boolean }) { console.log('Tree node selected:', event.node.label, event.selected); }

  // Toast
  showToast = signal(false);
  showToastNotification() { this.showToast.set(true); setTimeout(() => this.showToast.set(false), 5000); }
  onToastDismiss() { this.showToast.set(false); }

  // Modal
  isModalOpen = signal(false);
  openModal() { this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  // Command Menu
  isCommandMenuOpen = signal(false);
  commandItems = signal([
    { id: '1', label: 'Search Components', description: 'Find any component quickly', icon: '🔍', group: 'Navigation', shortcut: 'Ctrl+K' },
    { id: '2', label: 'Toggle Theme', description: 'Switch between light and dark mode', icon: '🌙', group: 'Settings', shortcut: 'Ctrl+T' },
    { id: '3', label: 'Copy Component', description: 'Copy component code to clipboard', icon: '📋', group: 'Actions', shortcut: 'Ctrl+C' },
    { id: '4', label: 'Open GitHub', description: 'View source code on GitHub', icon: '👨‍💻', group: 'External', shortcut: 'Ctrl+G' }
  ]);
  openCommandMenu() { this.isCommandMenuOpen.set(true); }
  closeCommandMenu() { this.isCommandMenuOpen.set(false); }
  onCommandSelect(item: any) { console.log('Command selected:', item.label); }

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

  // Date Picker
  selectedDate = signal<Date | null>(new Date());
  selectedDateRange = signal<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  selectedDates = signal<Date[]>([]);
  onDateChange(date: Date) {
    this.selectedDate.set(date);
    console.log('Date changed:', date);
  }
  onDateRangeChange(range: { start: Date | null; end: Date | null }) {
    this.selectedDateRange.set(range);
    console.log('Date range changed:', range);
  }
  onMultipleDatesChange(dates: Date[]) {
    this.selectedDates.set(dates);
    console.log('Multiple dates changed:', dates);
  }

  // Time Picker
  selectedTime = signal<{ hours: number; minutes: number; seconds?: number } | null>({ hours: 14, minutes: 30 });
  onTimeChange(time: { hours: number; minutes: number; seconds?: number }) {
    this.selectedTime.set(time);
    console.log('Time changed:', time);
  }

  // Navigation Rail
  navRailItems = signal<NavigationRailItem[]>([
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'explore', icon: '🔍', label: 'Explore', badge: 5 },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: 12 },
    { id: 'messages', icon: '💬', label: 'Messages', badge: 3 },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]);
  activeNavRailId = signal('home');
  navRailExpanded = signal(false);
  onNavRailItemClick(item: NavigationRailItem) {
    this.activeNavRailId.set(item.id);
    console.log('Navigation rail item clicked:', item.label);
  }
  onNavRailFabClick() {
    console.log('Navigation rail FAB clicked');
  }

  // Bottom Sheet
  isBottomSheetOpen = signal(false);
  openBottomSheet() { this.isBottomSheetOpen.set(true); }
  closeBottomSheet() { this.isBottomSheetOpen.set(false); }

  // Action Sheet
  isActionSheetOpen = signal(false);
  actionSheetActions = signal<ActionSheetAction[]>([
    { id: 'share', label: 'Share', icon: '🔗' },
    { id: 'edit', label: 'Edit', icon: '✏️' },
    { id: 'duplicate', label: 'Duplicate', icon: '📋' },
    { id: 'delete', label: 'Delete', icon: '🗑️', destructive: true },
  ]);
  openActionSheet() { this.isActionSheetOpen.set(true); }
  closeActionSheet() { this.isActionSheetOpen.set(false); }
  onActionSheetAction(action: ActionSheetAction) {
    console.log('Action sheet action:', action.label);
    this.closeActionSheet();
  }

  // P2 Enhancements Demo
  passwordInput = signal('');
  apiKeyValue = signal('sk-1234567890abcdef');
  bioInput = signal('');
}