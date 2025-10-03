import { Component, input } from '@angular/core';

type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'gray';

@Component({
  selector: 'ui-component',
  imports: [],
  template: ``,
  styles: ``
})
export abstract class UIComponent {
  colorScheme = input<ColorScheme>( 'blue');
  customClasses = input<string | string[] | undefined>(undefined);

  protected getColorClasses(scheme: ColorScheme = this.colorScheme()): Record<string, string> {
    return {
      primary: `bg-${scheme}-500 hover:bg-${scheme}-600 text-white`,
      secondary: `bg-${scheme}-100 hover:bg-${scheme}-200 text-${scheme}-800`,
      outline: `border-${scheme}-500 text-${scheme}-600 hover:bg-${scheme}-50`,
      ghost: `text-${scheme}-600 hover:bg-${scheme}-50`,
      text: `bg-${scheme}-500 text-white`,
      ring: `ring-${scheme}-500 focus:ring-${scheme}-500`,
    };
  }
  
  protected combineClasses(...classes: (string | string[] | undefined)[]): string {
    return classes
      .flat()
      .filter(Boolean)
      .join(' ');
  }
}
