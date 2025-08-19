import { Component } from '@angular/core';

@Component({
  selector: 'app-forms-demo',
  templateUrl: './forms-demo.component.html',
  styleUrls: ['./forms-demo.component.scss']
})
export class FormsDemoComponent {
  formStates = {
    withLabel: true,
    withHint: true,
    withError: false,
    disabled: false,
    required: true
  };

  toggleState(state: keyof typeof this.formStates) {
    this.formStates[state] = !this.formStates[state];
  }
}
