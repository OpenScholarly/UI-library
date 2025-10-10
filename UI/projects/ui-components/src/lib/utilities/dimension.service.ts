import { Injectable } from '@angular/core';

/**
 * Service for handling dimension conversions and calculations.
 * Provides utilities for converting various dimension inputs (string | number)
 * to CSS-compatible values and for parsing numeric values from dimensions.
 */
@Injectable({
  providedIn: 'root'
})
export class DimensionService {
  /**
   * Converts a dimension input (string | number) to a CSS value string.
   * - Numbers are converted to pixel values (e.g., 300 -> "300px")
   * - Numeric strings are normalized to pixel values (e.g., "300" -> "300px")
   * - Non-numeric strings with units are returned as-is (e.g., "100%", "20rem")
   * - Empty strings or invalid values return null
   * 
   * @param dimension - The dimension value to convert
   * @returns CSS-compatible dimension string or null
   * 
   * @example
   * toCssValue(300) // "300px"
   * toCssValue("300") // "300px" (normalized for consistency)
   * toCssValue("45.5") // "45.5px"
   * toCssValue("100%") // "100%"
   * toCssValue("20rem") // "20rem"
   * toCssValue("auto") // "auto"
   * toCssValue("") // null
   */
  toCssValue(dimension: string | number): string | null {
    if (typeof dimension === 'number') {
      if (isFinite(dimension) && dimension > 0) {
        return `${dimension}px`;
      } else {
        return null;
      }
    }
    if (typeof dimension === 'string' && dimension.trim() !== '') {
      const trimmed = dimension.trim();
      if (/^[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
        const n = Number(trimmed);
        if (isFinite(n) && n > 0) {
          return `${n}px`;
        } else {
          return null;
        }
      } else {
        return trimmed;
      }
    }
    return null;
  }

  /**
   * Converts a dimension input to a numeric value if possible.
   * - Numbers are returned as-is if finite and positive
   * - Numeric strings (e.g., "300", "45.5") are converted to numbers
   * - Non-numeric strings or invalid values return null
   * 
   * @param dimension - The dimension value to convert
   * @returns Numeric value or null
   * 
   * @example
   * toNumericValue(300) // 300
   * toNumericValue("450") // 450
   * toNumericValue("45.5") // 45.5
   * toNumericValue("100%") // null
   * toNumericValue("auto") // null
   */
  toNumericValue(dimension: unknown): number | null {
    if (typeof dimension === 'number' && isFinite(dimension) && dimension > 0) {
      return dimension;
    }
    if (typeof dimension === 'string') {
      const trimmed = dimension.trim();
      // Match pure numeric strings (integer or decimal)
      if (/^[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
        const n = Number(trimmed);
        return isFinite(n) && n > 0 ? n : null;
      }
    }
    return null;
  }

  /**
   * Calculates an aspect ratio string from width and height dimensions.
   * Both dimensions must be convertible to numeric values.
   * 
   * @param width - The width dimension
   * @param height - The height dimension
   * @returns Aspect ratio string (e.g., "16 / 9") or null
   * 
   * @example
   * calculateAspectRatio(1920, 1080) // "1920 / 1080"
   * calculateAspectRatio("800", "600") // "800 / 600"
   * calculateAspectRatio("100%", 600) // null (width not numeric)
   */
  calculateAspectRatio(width: unknown, height: unknown): string | null {
    const w = this.toNumericValue(width);
    const h = this.toNumericValue(height);
    if (w !== null && h !== null) {
      return `${w} / ${h}`;
    }
    return null;
  }
}
