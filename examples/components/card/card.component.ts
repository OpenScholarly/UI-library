import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-card]': 'true',
    '[class.lib-card--elevated]': 'elevated',
    '[class.lib-card--outlined]': '!elevated',
    '[class.lib-card--compact]': 'compact',
    '[class.lib-card--liquid]': 'variant === "liquid"'
  }
})
export class CardComponent {
  @Input() elevated = false;
  @Input() compact = false;
  @Input() variant: 'default' | 'liquid' = 'default';
}
