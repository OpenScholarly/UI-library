/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,ts}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Design token based colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: 'rgb(var(--ui-primary) / <alpha-value>)',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: 'rgb(var(--ui-secondary) / <alpha-value>)',
        success: 'rgb(var(--ui-success) / <alpha-value>)',
        danger: 'rgb(var(--ui-danger) / <alpha-value>)',
        warning: 'rgb(var(--ui-warning) / <alpha-value>)',
        info: 'rgb(var(--ui-info) / <alpha-value>)',
        
        // Surface colors
        surface: {
          DEFAULT: 'rgb(var(--ui-surface) / <alpha-value>)',
          light: 'rgb(var(--ui-surface-light) / <alpha-value>)',
          dark: 'rgb(var(--ui-surface-dark) / <alpha-value>)',
        },
        background: 'rgb(var(--ui-background) / <alpha-value>)',
        
        // Text colors
        text: {
          primary: 'rgb(var(--ui-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--ui-text-secondary) / <alpha-value>)',
          disabled: 'rgb(var(--ui-text-disabled) / <alpha-value>)',
          'on-primary': 'rgb(var(--ui-text-on-primary) / <alpha-value>)',
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
