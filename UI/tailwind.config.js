/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,ts}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Design token based colors - now theme-aware via CSS variables
        primary: {
          50: 'var(--primary-50, #eff6ff)',
          100: 'var(--primary-100, #dbeafe)',
          200: 'var(--primary-200, #bfdbfe)',
          300: 'var(--primary-300, #93c5fd)',
          400: 'var(--primary-400, #60a5fa)',
          500: 'var(--primary-500, #3b82f6)',
          600: 'var(--primary-600, #2563eb)',
          700: 'var(--primary-700, #1d4ed8)',
          800: 'var(--primary-800, #1e40af)',
          900: 'var(--primary-900, #1e3a8a)',
          DEFAULT: 'var(--ui-primary, #3b82f6)',
          light: 'var(--ui-primaryLight, #60a5fa)',
          dark: 'var(--ui-primaryDark, #1d4ed8)',
        },
        secondary: {
          50: 'var(--secondary-50, #f9fafb)',
          100: 'var(--secondary-100, #f3f4f6)',
          200: 'var(--secondary-200, #e5e7eb)',
          300: 'var(--secondary-300, #d1d5db)',
          400: 'var(--secondary-400, #9ca3af)',
          500: 'var(--secondary-500, #6b7280)',
          600: 'var(--secondary-600, #4b5563)',
          700: 'var(--secondary-700, #374151)',
          800: 'var(--secondary-800, #1f2937)',
          900: 'var(--secondary-900, #111827)',
          DEFAULT: 'var(--ui-secondary, #6b7280)',
          light: 'var(--ui-secondaryLight, #9ca3af)',
          dark: 'var(--ui-secondaryDark, #374151)',
        },
        accent: {
          50: 'var(--accent-50, #fef2f2)',
          100: 'var(--accent-100, #fee2e2)',
          200: 'var(--accent-200, #fecaca)',
          300: 'var(--accent-300, #fca5a5)',
          400: 'var(--accent-400, #f87171)',
          500: 'var(--accent-500, #ef4444)',
          600: 'var(--accent-600, #dc2626)',
          700: 'var(--accent-700, #b91c1c)',
          800: 'var(--accent-800, #991b1b)',
          900: 'var(--accent-900, #7f1d1d)',
          DEFAULT: 'var(--ui-accent, #ef4444)',
          light: 'var(--ui-accentLight, #f87171)',
          dark: 'var(--ui-accentDark, #b91c1c)',
        },
        success: 'rgb(var(--ui-success, 40 167 69) / <alpha-value>)',
        danger: 'rgb(var(--ui-danger, 220 53 69) / <alpha-value>)',
        warning: 'rgb(var(--ui-warning, 255 193 7) / <alpha-value>)',
        info: 'rgb(var(--ui-info, 23 162 184) / <alpha-value>)',
        
        // Surface colors
        surface: {
          DEFAULT: 'rgb(var(--ui-surface, 255 255 255) / <alpha-value>)',
          light: 'rgb(var(--ui-surface-light, 249 250 251) / <alpha-value>)',
          dark: 'rgb(var(--ui-surface-dark, 229 231 235) / <alpha-value>)',
        },
        background: 'rgb(var(--ui-background, 243 244 246) / <alpha-value>)',
        
        // Text colors
        text: {
          primary: 'rgb(var(--ui-text-primary, 17 24 39) / <alpha-value>)',
          secondary: 'rgb(var(--ui-text-secondary, 55 65 81) / <alpha-value>)',
          disabled: 'rgb(var(--ui-text-disabled, 156 163 175) / <alpha-value>)',
          'on-primary': 'rgb(var(--ui-text-on-primary, 255 255 255) / <alpha-value>)',
        },
        
        // Glass colors for liquid glass effects
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          'bg-dark': 'rgba(0, 0, 0, 0.1)',
          'border-dark': 'rgba(255, 255, 255, 0.1)',
        },
        
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['var(--font-family-base)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        '1': 'var(--elevation-1)',
        '2': 'var(--elevation-2)',
        '3': 'var(--elevation-3)',
        '4': 'var(--elevation-4)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        DEFAULT: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--motion-easing-standard)',
        accelerate: 'var(--motion-easing-accelerate)',
        decelerate: 'var(--motion-easing-decelerate)',
      },
      zIndex: {
        dropdown: 'var(--z-index-dropdown)',
        sticky: 'var(--z-index-sticky)',
        fixed: 'var(--z-index-fixed)',
        'modal-backdrop': 'var(--z-index-modal-backdrop)',
        modal: 'var(--z-index-modal)',
        popover: 'var(--z-index-popover)',
        tooltip: 'var(--z-index-tooltip)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn var(--motion-duration-base) var(--motion-easing-decelerate)',
        'fade-out': 'fadeOut var(--motion-duration-base) var(--motion-easing-accelerate)',
        'slide-up': 'slideUp var(--motion-duration-base) var(--motion-easing-decelerate)',
        'slide-down': 'slideDown var(--motion-duration-base) var(--motion-easing-decelerate)',
        'scale-in': 'scaleIn var(--motion-duration-fast) var(--motion-easing-decelerate)',
        'scale-out': 'scaleOut var(--motion-duration-fast) var(--motion-easing-accelerate)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    // Custom utilities plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Focus ring utilities
        '.focus-ring': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': '0 0 0 2px var(--ui-primary), 0 0 0 4px rgba(var(--ui-primary), 0.2)',
          },
        },
        '.focus-ring-inset': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            'outline-offset': '-2px',
            'box-shadow': 'inset 0 0 0 2px var(--ui-primary)',
          },
        },
        '.focus-ring-danger': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': '0 0 0 2px var(--ui-danger), 0 0 0 4px rgba(var(--ui-danger), 0.2)',
          },
        },
        
        // Glass effect utilities
        '.glass': {
          'backdrop-filter': 'blur(12px) saturate(180%)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(12px) saturate(180%)',
          'background-color': 'rgba(0, 0, 0, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          'backdrop-filter': 'blur(20px) saturate(200%)',
          'background-color': 'rgba(255, 255, 255, 0.15)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        
        // Screen reader utilities
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          border: '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          'white-space': 'normal',
        },
        
        // Transition utilities
        '.transition-glass': {
          transition: 'backdrop-filter var(--motion-duration-base) var(--motion-easing-standard), background-color var(--motion-duration-base) var(--motion-easing-standard)',
        },
        '.transition-transform-opacity': {
          transition: 'transform var(--motion-duration-base) var(--motion-easing-standard), opacity var(--motion-duration-base) var(--motion-easing-standard)',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}
