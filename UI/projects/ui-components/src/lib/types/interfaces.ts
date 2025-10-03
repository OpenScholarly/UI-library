/**
 * Interface definitions for UI components
 * These define the data structures used across components
 */

// Accordion
export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
  expanded?: boolean;
}

// Navigation
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  href?: string;
  divider?: boolean;
  children?: MenuItem[];
}

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
}

export interface NavigationItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavigationItem[];
  active?: boolean;
}

export interface NavbarItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavbarItem[];
  badge?: string | number;
}

// Forms
export interface SegmentedButtonOption {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

export interface SplitButtonAction {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

// Data display
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => string;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface FeedItem {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date | string;
  actions?: { label: string; onClick: () => void }[];
}

export interface CarouselItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

// Layout
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface BannerAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Overlays
export interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  onSelect: () => void;
}

// Feedback
export interface ToastData {
  id?: string;
  message: string;
  title?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  duration?: number;
  dismissible?: boolean;
}
