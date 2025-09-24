import { Injectable } from '@angular/core';

export type Placement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface PositionResult {
  x: number;
  y: number;
  placement: Placement;
  arrow?: { x: number; y: number };
}

export interface PositionOptions {
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  arrow?: boolean;
  arrowElement?: HTMLElement;
}

/**
 * Service for positioning floating elements relative to reference elements
 * Basic implementation - for production, consider using @floating-ui/dom
 */
@Injectable({
  providedIn: 'root'
})
export class PositioningService {

  /**
   * Position a floating element relative to a reference element
   */
  position(
    referenceElement: HTMLElement,
    floatingElement: HTMLElement,
    options: PositionOptions = {}
  ): PositionResult {
    const {
      placement = 'bottom',
      offset = 8,
      flip = true,
      shift = true,
      arrow = false,
      arrowElement
    } = options;

    const referenceRect = referenceElement.getBoundingClientRect();
    const floatingRect = floatingElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalPlacement = placement;
    let x = 0;
    let y = 0;

    // Calculate initial position based on placement
    const positions = this.calculatePositions(referenceRect, floatingRect, offset);
    
    ({ x, y } = positions[placement]);

    // Apply flip if enabled and element would overflow
    if (flip) {
      const wouldOverflow = this.checkOverflow(x, y, floatingRect, viewportWidth, viewportHeight);
      
      if (wouldOverflow) {
        const flippedPlacement = this.getFlippedPlacement(placement);
        const flippedPosition = positions[flippedPlacement];
        
        if (flippedPosition) {
          const flippedOverflow = this.checkOverflow(
            flippedPosition.x,
            flippedPosition.y,
            floatingRect,
            viewportWidth,
            viewportHeight
          );
          
          // Use flipped position if it's better
          if (!flippedOverflow || this.isLessOverflow(flippedPosition, { x, y }, floatingRect, viewportWidth, viewportHeight)) {
            x = flippedPosition.x;
            y = flippedPosition.y;
            finalPlacement = flippedPlacement;
          }
        }
      }
    }

    // Apply shift if enabled
    if (shift) {
      const shifted = this.applyShift(x, y, floatingRect, viewportWidth, viewportHeight);
      x = shifted.x;
      y = shifted.y;
    }

    // Calculate arrow position if needed
    let arrowPosition: { x: number; y: number } | undefined;
    if (arrow && arrowElement) {
      arrowPosition = this.calculateArrowPosition(
        referenceRect,
        floatingElement,
        arrowElement,
        finalPlacement,
        x,
        y
      );
    }

    return {
      x,
      y,
      placement: finalPlacement,
      arrow: arrowPosition
    };
  }

  /**
   * Apply positioning to the floating element
   */
  applyPosition(element: HTMLElement, result: PositionResult): void {
    element.style.position = 'fixed';
    element.style.left = `${result.x}px`;
    element.style.top = `${result.y}px`;
    element.style.zIndex = 'var(--z-index-popover)';

    // Apply arrow position if provided
    if (result.arrow && element.querySelector('.arrow')) {
      const arrowEl = element.querySelector('.arrow') as HTMLElement;
      arrowEl.style.left = `${result.arrow.x}px`;
      arrowEl.style.top = `${result.arrow.y}px`;
    }
  }

  /**
   * Calculate all possible positions for a placement
   */
  private calculatePositions(
    referenceRect: DOMRect,
    floatingRect: DOMRect,
    offset: number
  ): Record<Placement, { x: number; y: number }> {
    const { left, right, top, bottom, width, height } = referenceRect;
    const { width: floatingWidth, height: floatingHeight } = floatingRect;

    return {
      'top': {
        x: left + width / 2 - floatingWidth / 2,
        y: top - floatingHeight - offset
      },
      'top-start': {
        x: left,
        y: top - floatingHeight - offset
      },
      'top-end': {
        x: right - floatingWidth,
        y: top - floatingHeight - offset
      },
      'bottom': {
        x: left + width / 2 - floatingWidth / 2,
        y: bottom + offset
      },
      'bottom-start': {
        x: left,
        y: bottom + offset
      },
      'bottom-end': {
        x: right - floatingWidth,
        y: bottom + offset
      },
      'left': {
        x: left - floatingWidth - offset,
        y: top + height / 2 - floatingHeight / 2
      },
      'left-start': {
        x: left - floatingWidth - offset,
        y: top
      },
      'left-end': {
        x: left - floatingWidth - offset,
        y: bottom - floatingHeight
      },
      'right': {
        x: right + offset,
        y: top + height / 2 - floatingHeight / 2
      },
      'right-start': {
        x: right + offset,
        y: top
      },
      'right-end': {
        x: right + offset,
        y: bottom - floatingHeight
      }
    };
  }

  /**
   * Check if position would cause overflow
   */
  private checkOverflow(
    x: number,
    y: number,
    floatingRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): boolean {
    return (
      x < 0 ||
      y < 0 ||
      x + floatingRect.width > viewportWidth ||
      y + floatingRect.height > viewportHeight
    );
  }

  /**
   * Get the opposite placement for flipping
   */
  private getFlippedPlacement(placement: Placement): Placement {
    const flips: Record<Placement, Placement> = {
      'top': 'bottom',
      'top-start': 'bottom-start',
      'top-end': 'bottom-end',
      'bottom': 'top',
      'bottom-start': 'top-start',
      'bottom-end': 'top-end',
      'left': 'right',
      'left-start': 'right-start',
      'left-end': 'right-end',
      'right': 'left',
      'right-start': 'left-start',
      'right-end': 'left-end'
    };
    return flips[placement];
  }

  /**
   * Check which position has less overflow
   */
  private isLessOverflow(
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
    floatingRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): boolean {
    const overflow1 = this.calculateOverflowAmount(pos1, floatingRect, viewportWidth, viewportHeight);
    const overflow2 = this.calculateOverflowAmount(pos2, floatingRect, viewportWidth, viewportHeight);
    return overflow1 < overflow2;
  }

  /**
   * Calculate the amount of overflow
   */
  private calculateOverflowAmount(
    position: { x: number; y: number },
    floatingRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): number {
    let overflow = 0;
    
    if (position.x < 0) overflow += Math.abs(position.x);
    if (position.y < 0) overflow += Math.abs(position.y);
    if (position.x + floatingRect.width > viewportWidth) {
      overflow += (position.x + floatingRect.width) - viewportWidth;
    }
    if (position.y + floatingRect.height > viewportHeight) {
      overflow += (position.y + floatingRect.height) - viewportHeight;
    }
    
    return overflow;
  }

  /**
   * Apply shift to keep element in viewport
   */
  private applyShift(
    x: number,
    y: number,
    floatingRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): { x: number; y: number } {
    let shiftedX = x;
    let shiftedY = y;

    // Shift horizontally
    if (x < 0) {
      shiftedX = 0;
    } else if (x + floatingRect.width > viewportWidth) {
      shiftedX = viewportWidth - floatingRect.width;
    }

    // Shift vertically
    if (y < 0) {
      shiftedY = 0;
    } else if (y + floatingRect.height > viewportHeight) {
      shiftedY = viewportHeight - floatingRect.height;
    }

    return { x: shiftedX, y: shiftedY };
  }

  /**
   * Calculate arrow position
   */
  private calculateArrowPosition(
    referenceRect: DOMRect,
    floatingElement: HTMLElement,
    arrowElement: HTMLElement,
    placement: Placement,
    floatingX: number,
    floatingY: number
  ): { x: number; y: number } {
    const arrowRect = arrowElement.getBoundingClientRect();
    const arrowSize = Math.max(arrowRect.width, arrowRect.height);
    
    const referenceCenter = {
      x: referenceRect.left + referenceRect.width / 2,
      y: referenceRect.top + referenceRect.height / 2
    };

    let arrowX = 0;
    let arrowY = 0;

    if (placement.startsWith('top') || placement.startsWith('bottom')) {
      arrowX = referenceCenter.x - floatingX - arrowSize / 2;
      arrowY = placement.startsWith('top') ? 
        floatingElement.offsetHeight - arrowSize / 2 : 
        -arrowSize / 2;
    } else {
      arrowX = placement.startsWith('left') ? 
        floatingElement.offsetWidth - arrowSize / 2 : 
        -arrowSize / 2;
      arrowY = referenceCenter.y - floatingY - arrowSize / 2;
    }

    return { x: arrowX, y: arrowY };
  }
}