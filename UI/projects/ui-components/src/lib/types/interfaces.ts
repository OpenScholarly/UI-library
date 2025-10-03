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
  disabled?: boolean;
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
  separator?: boolean;
  children?: MenuItem[];
  value?: any;
}

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  badge?: string;
  disabled?: boolean;
}

export interface NavbarItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  active?: boolean;
  badge?: string | number;
  disabled?: boolean;
  children?: NavbarItem[];
}

// Forms
export interface SegmentedButtonOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export interface SplitButtonAction {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface AutocompleteOption {
  value: string;
  label: string;
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
  category?: string;
  url?: string;
  metadata?: Record<string, any>;
}

// Data display
export interface TableColumn<T = any> {
  key: keyof T;
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
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  content: string;
  timestamp: Date;
  likes?: number;
  comments?: number;
  shares?: number;
  images?: string[];
  type?: 'text' | 'image' | 'video' | 'link';
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface CarouselItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: string;
  description?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  status?: 'completed' | 'active' | 'pending' | 'cancelled';
  icon?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
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
  variant?: 'primary' | 'secondary' | 'ghost';
  handler?: () => void;
}

// Overlays
export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  disabled?: boolean;
  action?: () => void;
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
