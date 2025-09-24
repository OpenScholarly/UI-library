import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-form-field]': 'true',
    '[class.lib-form-field--disabled]': 'disabled',
    '[class.lib-form-field--required]': 'required',
    '[class.lib-form-field--has-error]': '!!error',
    '[class.lib-form-field--dense]': 'dense'
  }
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() dense = false;

  @ContentChild('prefix') prefixTemplate?: TemplateRef<any>;
  @ContentChild('suffix') suffixTemplate?: TemplateRef<any>;
}
