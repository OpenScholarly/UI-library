/**
 * Position and placement types for UI components
 * These define the positioning options available across components
 */

// Toast positions
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

// Menu placements
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';

// Tooltip triggers
export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';
export type MenuTrigger = 'click' | 'hover';

// Layout sidebar positions
export type LayoutSidebarPosition = 'left' | 'right';
export type LayoutSidebarBehavior = 'fixed' | 'overlay' | 'push';

// FAB positions
export type FabPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'static';
