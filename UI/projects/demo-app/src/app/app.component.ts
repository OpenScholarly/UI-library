import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navLinks = [
    { path: '/buttons', label: 'Buttons' },
    { path: '/cards', label: 'Cards' },
    { path: '/forms', label: 'Forms' }
  ];
}
