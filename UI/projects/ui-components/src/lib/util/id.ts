/**
 * Small helper to generate compact unique IDs for component instances.
 * Use this in constructors to avoid having the same ID across multiple instances
 * when the code runs at module evaluation time.
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}
