/**
 * Comprehensive Color Theme System
 * 
 * This file defines color palettes with clear role assignments (primary, secondary, accent, etc.)
 * for seamless theme integration in the UI library.
 * 
 * Aligns with existing design tokens and Tailwind configuration.
 */

export interface ColorPalette {
  [key: string]: string;
}

export interface ColorRoles {
  primary?: string;
  primaryLight?: string;
  primaryDark?: string;
  secondary?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  accent?: string;
  accentAlt?: string;
  surface?: string;
  surfaceLight?: string;
  surfaceDark?: string;
  surfaceAlt?: string;
  contrast?: string;
  neutral?: string;
}

/**
 * CSS Variable Mapping for Tailwind integration
 * Maps theme color roles to CSS variable names used in tailwind.config.js
 */
export interface CSSVariableMapping {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
}

export interface ThemeColors {
  name: string;
  description: string;
  mainColor: string;
  palette: {
    primary: ColorPalette;
  };
  roles: ColorRoles;
}

export interface ThemeColorSystem {
  themes: {
    [key: string]: ThemeColors;
  };
  semanticColors: {
    description: string;
    colors: {
      success: ColorPalette;
      danger: ColorPalette;
      warning: ColorPalette;
      info: ColorPalette;
    };
  };
  neutralColors: {
    description: string;
    colors: {
      gray: ColorPalette;
    };
  };
}

/**
 * Complete color theme system with role-based color assignments
 */
export const ThemeColorSystem: ThemeColorSystem = {
  themes: {
    'ocean-blue': {
      name: 'Tech Forward - Deep Ocean Blue',
      description: 'Projects trust, innovation, and professionalism. Perfect for tech, fintech, and SaaS applications.',
      mainColor: '#1851A3',
      palette: {
        primary: {
          '50': '#E3F2FD',
          '100': '#BBDEFB',
          '200': '#90CAF9',
          '300': '#64B5F6',
          '400': '#42A5F5',
          '500': '#1851A3',
          '600': '#1565C0',
          '700': '#0D47A1',
          '800': '#0A3D91',
          '900': '#073081'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        primaryDark: '700',
        accent: '400',
        surface: '50'
      }
    },
    'forest-green': {
      name: 'Organic Modern - Forest Green',
      description: 'Sustainable, trustworthy, and contemporary. Ideal for health, finance, and eco-friendly brands.',
      mainColor: '#2D5F3F',
      palette: {
        primary: {
          '50': '#E8F5E8',
          '100': '#C8E6C9',
          '200': '#A5D6A7',
          '300': '#81C784',
          '400': '#66BB6A',
          '500': '#2D5F3F',
          '600': '#388E3C',
          '700': '#2E7D32',
          '800': '#1B5E20',
          '900': '#0F4C1A'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        primaryDark: '700',
        accent: '400',
        surface: '50'
      }
    },
    'vibrant-purple': {
      name: 'Creative Edge - Vibrant Purple',
      description: 'Creative, innovative, and premium. Perfect for creative agencies, entertainment, and luxury brands.',
      mainColor: '#6B46C1',
      palette: {
        primary: {
          '50': '#F3E8FF',
          '100': '#E9D5FF',
          '200': '#D8B4FE',
          '300': '#C084FC',
          '400': '#A855F7',
          '500': '#6B46C1',
          '600': '#7C3AED',
          '700': '#6D28D9',
          '800': '#5B21B6',
          '900': '#4C1D95'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        primaryDark: '700',
        accent: '400',
        surface: '50'
      }
    },
    'sunset-orange': {
      name: 'Warm & Approachable - Sunset Orange',
      description: 'Energetic, friendly, and attention-grabbing. Great for education, food, and lifestyle brands.',
      mainColor: '#EA580C',
      palette: {
        primary: {
          '50': '#FFF7ED',
          '100': '#FFEDD5',
          '200': '#FED7AA',
          '300': '#FDBA74',
          '400': '#FB923C',
          '500': '#EA580C',
          '600': '#DC2626',
          '700': '#C2410C',
          '800': '#9A3412',
          '900': '#7C2D12'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        primaryDark: '700',
        accent: '400',
        surface: '50'
      }
    },
    'beach-landscape': {
      name: 'Beach Landscape',
      description: 'Warm, natural, earthy tones inspired by beach landscapes.',
      mainColor: '#BF9169',
      palette: {
        primary: {
          '100': '#F2EFE9',
          '300': '#D9C7B8',
          '500': '#BF9169',
          '700': '#8C5B3F',
          '900': '#593E2E'
        }
      },
      roles: {
        primary: '500',
        secondary: '700',
        accent: '300',
        surface: '100',
        surfaceDark: '900'
      }
    },
    'villa-real-estate': {
      name: 'Villa Real-Estate',
      description: 'Sophisticated neutral palette for real estate and luxury properties.',
      mainColor: '#8C8377',
      palette: {
        primary: {
          '100': '#D9D9D9',
          '200': '#A6A5A4',
          '500': '#8C8377',
          '700': '#403B36',
          '900': '#0D0D0D'
        }
      },
      roles: {
        primary: '500',
        secondary: '700',
        accent: '200',
        surface: '100',
        surfaceDark: '900'
      }
    },
    'sun-blue-autumn': {
      name: 'Sun, Blue Sky and Autumn',
      description: 'Vibrant combination of sky blues and warm autumn tones.',
      mainColor: '#79A3D9',
      palette: {
        primary: {
          '100': '#C4DDF2',
          '300': '#79A3D9',
          '500': '#BF7B3F',
          '700': '#73461F',
          '800': '#F2A35E'
        }
      },
      roles: {
        primary: '300',
        secondary: '500',
        accent: '800',
        surface: '100',
        contrast: '700'
      }
    },
    'barren-desert': {
      name: 'Barren Desert Landscape',
      description: 'Cool blues meeting warm desert tones.',
      mainColor: '#4E9DA6',
      palette: {
        primary: {
          '200': '#024059',
          '400': '#126173',
          '500': '#4E9DA6',
          '700': '#D9A679',
          '900': '#A65437'
        }
      },
      roles: {
        primary: '500',
        primaryDark: '200',
        secondary: '700',
        accent: '900',
        contrast: '400'
      }
    },
    'tozeur': {
      name: 'Desert Terracotta',
      description: 'Warm terracotta and peachy tones inspired by desert architecture.',
      mainColor: '#F2A35E',
      palette: {
        primary: {
          '100': '#F2C1AE',
          '200': '#BF9C99',
          '300': '#F29863',
          '500': '#F2A35E',
          '700': '#BF5D24'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        secondary: '700',
        accent: '100',
        neutral: '200'
      }
    },
    'lader-neutral': {
      name: 'Bold Citrus',
      description: 'Bold orange palette with neutral accents.',
      mainColor: '#F26430',
      palette: {
        primary: {
          '100': '#F2F2F2',
          '200': '#F2C1AE',
          '300': '#F2865E',
          '500': '#F26430',
          '700': '#F24F13'
        }
      },
      roles: {
        primary: '500',
        primaryDark: '700',
        primaryLight: '300',
        accent: '200',
        surface: '100'
      }
    },
    'wilderness-forest': {
      name: 'Wilderness Landscape Forest',
      description: 'Dark, moody forest greens with neutral accents.',
      mainColor: '#9DA65D',
      palette: {
        primary: {
          '100': '#F2F2F2',
          '200': '#8C8C88',
          '400': '#9DA65D',
          '600': '#6C733D',
          '900': '#202426'
        }
      },
      roles: {
        primary: '400',
        primaryDark: '600',
        secondary: '200',
        surface: '100',
        surfaceDark: '900'
      }
    },
    'safari': {
      name: 'Safari',
      description: 'Earthy safari tones with cool accents.',
      mainColor: '#BF8C6F',
      palette: {
        primary: {
          '100': '#D9D8D2',
          '300': '#7C96A6',
          '500': '#BF8C6F',
          '700': '#8C5B49',
          '900': '#40282C'
        }
      },
      roles: {
        primary: '500',
        secondary: '700',
        accent: '300',
        surface: '100',
        surfaceDark: '900'
      }
    },
    'pawhome': {
      name: 'Playful Sunset',
      description: 'Playful pink and orange palette with warm accents.',
      mainColor: '#F29F05',
      palette: {
        primary: {
          '100': '#F2DCC2',
          '300': '#F294C0',
          '500': '#F29F05',
          '700': '#F27405',
          '900': '#A65424'
        }
      },
      roles: {
        primary: '500',
        secondary: '700',
        accent: '300',
        surface: '100',
        contrast: '900'
      }
    },
    'platform': {
      name: 'Platform',
      description: 'Bold blue tech palette with light accents.',
      mainColor: '#295BF2',
      palette: {
        primary: {
          '100': '#F2F2F2',
          '200': '#91B2F2',
          '400': '#295BF2',
          '600': '#0511F2',
          '700': '#D3CEF2'
        }
      },
      roles: {
        primary: '400',
        primaryDark: '600',
        accent: '200',
        surface: '100',
        surfaceAlt: '700'
      }
    },
    'sunflower': {
      name: 'Sunflower',
      description: 'Fresh green and warm orange combination.',
      mainColor: '#D9831A',
      palette: {
        primary: {
          '100': '#D9CBBF',
          '300': '#6AA67F',
          '500': '#D9831A',
          '600': '#1C8C4D',
          '800': '#8C501B'
        }
      },
      roles: {
        primary: '500',
        secondary: '600',
        accent: '300',
        surface: '100',
        contrast: '800'
      }
    },
    'naqch': {
      name: 'Clay & Rust',
      description: 'Warm terracotta gradient palette.',
      mainColor: '#A65E4E',
      palette: {
        primary: {
          '100': '#F2E0D0',
          '300': '#BFA095',
          '500': '#A65E4E',
          '700': '#735149',
          '900': '#401713'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '300',
        secondary: '700',
        surface: '100',
        surfaceDark: '900'
      }
    },
    'neiman-marcus': {
      name: 'Golden Luxury',
      description: 'Luxurious warm palette with golden accents.',
      mainColor: '#BF8665',
      palette: {
        primary: {
          '100': '#F2F2F0',
          '300': '#F2DC99',
          '400': '#D5D973',
          '500': '#BF8665',
          '800': '#8C472E'
        }
      },
      roles: {
        primary: '500',
        secondary: '800',
        accent: '400',
        accentAlt: '300',
        surface: '100'
      }
    },
    'rocky-salam': {
      name: 'Coastal Breeze',
      description: 'Cool cyan blues with warm neutral accents.',
      mainColor: '#049DBF',
      palette: {
        primary: {
          '100': '#D9C9BA',
          '300': '#A6886D',
          '400': '#04ADBF',
          '500': '#049DBF',
          '700': '#0378A6'
        }
      },
      roles: {
        primary: '500',
        primaryLight: '400',
        primaryDark: '700',
        secondary: '300',
        surface: '100'
      }
    },
    'beauty': {
      name: 'Beauty',
      description: 'Vibrant pink and warm orange palette.',
      mainColor: '#D96A93',
      palette: {
        primary: {
          '100': '#F2D8CE',
          '300': '#F2994B',
          '500': '#D96A93',
          '700': '#A63348',
          '900': '#8C2A14'
        }
      },
      roles: {
        primary: '500',
        primaryDark: '700',
        accent: '300',
        surface: '100',
        contrast: '900'
      }
    }
  },
  semanticColors: {
    description: 'Standard semantic colors used across all themes',
    colors: {
      success: {
        light: '#d4edda',
        main: '#28a745',
        dark: '#1e7e34'
      },
      danger: {
        light: '#f8d7da',
        main: '#dc3545',
        dark: '#bd2130'
      },
      warning: {
        light: '#fff3cd',
        main: '#ffc107',
        dark: '#e0a800'
      },
      info: {
        light: '#d1ecf1',
        main: '#17a2b8',
        dark: '#117a8b'
      }
    }
  },
  neutralColors: {
    description: 'Neutral gray scale used across all themes',
    colors: {
      gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827'
      }
    }
  }
};

/**
 * Helper function to get color by role from a theme
 */
export function getColorByRole(themeKey: string, role: keyof ColorRoles): string | undefined {
  const theme = ThemeColorSystem.themes[themeKey];
  if (!theme) return undefined;
  
  const shadeKey = theme.roles[role];
  if (!shadeKey) return undefined;
  
  return theme.palette.primary[shadeKey];
}

/**
 * Helper function to get all colors with their roles for a theme
 */
export function getThemeColorsByRole(themeKey: string): Record<string, string> {
  const theme = ThemeColorSystem.themes[themeKey];
  if (!theme) return {};
  
  const result: Record<string, string> = {};
  
  Object.entries(theme.roles).forEach(([role, shadeKey]) => {
    const color = theme.palette.primary[shadeKey];
    if (color) {
      result[role] = color;
    }
  });
  
  return result;
}

/**
 * Get list of all available theme keys
 */
export function getAvailableThemes(): string[] {
  return Object.keys(ThemeColorSystem.themes);
}

/**
 * Get theme information
 */
export function getThemeInfo(themeKey: string): Pick<ThemeColors, 'name' | 'description' | 'mainColor'> | undefined {
  const theme = ThemeColorSystem.themes[themeKey];
  if (!theme) return undefined;
  
  return {
    name: theme.name,
    description: theme.description,
    mainColor: theme.mainColor
  };
}

/**
 * Generate CSS variables for a theme that align with Tailwind configuration
 * Returns an object with CSS variable names as keys and colors as values
 * 
 * Example usage:
 * ```typescript
 * const vars = getCSSVariables('ocean-blue');
 * Object.entries(vars).forEach(([varName, color]) => {
 *   document.documentElement.style.setProperty(varName, color);
 * });
 * ```
 */
export function getCSSVariables(themeKey: string): Record<string, string> {
  const theme = ThemeColorSystem.themes[themeKey];
  if (!theme) return {};
  
  const colors = getThemeColorsByRole(themeKey);
  const cssVars: Record<string, string> = {};
  
  // Map role names to CSS variable names matching tailwind.config.js
  if (colors['primary']) cssVars['--ui-primary'] = colors['primary'];
  if (colors['primaryLight']) cssVars['--ui-primary-light'] = colors['primaryLight'];
  if (colors['primaryDark']) cssVars['--ui-primary-dark'] = colors['primaryDark'];
  if (colors['secondary']) cssVars['--ui-secondary'] = colors['secondary'];
  if (colors['surface']) cssVars['--ui-surface'] = colors['surface'];
  if (colors['surfaceLight']) cssVars['--ui-surface-light'] = colors['surfaceLight'];
  if (colors['surfaceDark']) cssVars['--ui-surface-dark'] = colors['surfaceDark'];
  if (colors['accent']) cssVars['--ui-accent'] = colors['accent'];
  
  // Add all palette shades as --primary-{shade} variables (matching Themes.md pattern)
  Object.entries(theme.palette.primary).forEach(([shade, color]) => {
    cssVars[`--primary-${shade}`] = color;
  });
  
  return cssVars;
}

/**
 * Apply theme CSS variables to document root
 * This helper makes it easy to integrate with existing ThemeService
 * 
 * Example:
 * ```typescript
 * applyThemeVariables('ocean-blue');
 * ```
 */
export function applyThemeVariables(themeKey: string): boolean {
  const cssVars = getCSSVariables(themeKey);
  
  if (Object.keys(cssVars).length === 0) {
    return false;
  }
  
  Object.entries(cssVars).forEach(([varName, color]) => {
    document.documentElement.style.setProperty(varName, color);
  });
  
  // Set data-theme attribute for CSS targeting
  document.documentElement.setAttribute('data-theme', themeKey);
  
  return true;
}
