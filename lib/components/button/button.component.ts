import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-btn]': 'true',
    '[class.lib-btn--primary]': 'variant === "primary"',
    '[class.lib-btn--secondary]': 'variant === "secondary"',
    '[class.lib-btn--tertiary]': 'variant === "tertiary"',
    '[class.lib-btn--text]': 'variant === "text"',
    '[class.lib-btn--ghost]': 'variant === "ghost"',
    '[class.lib-btn--danger]': 'variant === "danger"',
    '[class.lib-btn--success]': 'variant === "success"',
    '[class.lib-btn--sm]': 'size === "sm"',
    '[class.lib-btn--md]': 'size === "md"',
    '[class.lib-btn--lg]': 'size === "lg"',
    '[class.lib-btn--xl]': 'size === "xl"',
    '[class.lib-btn--disabled]': 'disabled',
    '[class.lib-btn--loading]': 'loading',
    '[attr.disabled]': 'disabled || loading || null',
    '[attr.aria-disabled]': 'disabled || loading',
    '[attr.aria-pressed]': 'pressed',
    '[attr.aria-label]': 'ariaLabel',
    'role': 'button',
    'tabindex': '0'
  }
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'ghost' | 'danger' | 'success' | 'link' = 'primary';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() ariaLabel?: string;
  @Input() pressed?: boolean;
  @Input() allowFocusRipple = true;

  @Output() click = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }
    this.click.emit(event);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.disabled && !this.loading) {
        this.click.emit(event as unknown as MouseEvent);
      }
    }
  }
}
