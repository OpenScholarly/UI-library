/**
 * Miscellaneous types for UI components
 * These define various other type options that don't fit into other categories
 */

// Avatar status
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'dnd';

// Progress types
export type ProgressType = 'linear' | 'circular';

// Loader types
export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';

// Typography weights
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

// Heading levels
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// Image fit
export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImageRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Textarea resize
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

// Grid layout
export type GridCols = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColumnSpan = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'auto' | 'full';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type RowGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Table sorting
export type SortDirection = 'asc' | 'desc' | null;

// Input types
export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

// Theme modes
export type ThemeMode = 'system' | 'light' | 'dark';
