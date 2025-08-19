import { Component } from '@angular/core';

@Component({
  selector: 'app-buttons-demo',
  templateUrl: './buttons-demo.component.html',
  styleUrls: ['./buttons-demo.component.scss']
})
export class ButtonsDemoComponent {
  variants = ['primary', 'secondary', 'tertiary', 'text', 'ghost', 'danger', 'success', 'link'];
  sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  
  loading = false;
  disabled = false;

  toggleLoading() {
    this.loading = !this.loading;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }
}
