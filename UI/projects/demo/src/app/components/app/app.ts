import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// import { ButtonComponent, CardComponent } from 'ui-components'; // for production use, import from 'ui-components' package
import { ButtonComponent } from '../../../../../ui-components/src/lib/components/button/button.component';
import { CardComponent } from '../../../../../ui-components/src/lib/components/card/card.component';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <header class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">UI Components Library</h1>
          <p class="text-gray-600">Modern Angular 20+ components with Tailwind CSS</p>
        </header>

        <ui-card>
          <h2 class="text-2xl font-semibold mb-6 text-gray-900">Button Components</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium mb-3 text-gray-700">Variants</h3>
              <div class="flex flex-wrap gap-3">
                <ui-button variant="primary" (clicked)="onButtonClick('Primary')">Primary</ui-button>
                <ui-button variant="secondary" (clicked)="onButtonClick('Secondary')">Secondary</ui-button>
                <ui-button variant="outline" (clicked)="onButtonClick('Outline')">Outline</ui-button>
                <ui-button variant="ghost" (clicked)="onButtonClick('Ghost')">Ghost</ui-button>
                <ui-button variant="destructive" (clicked)="onButtonClick('Destructive')">Destructive</ui-button>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3 text-gray-700">Sizes</h3>
              <div class="flex flex-wrap items-center gap-3">
                <ui-button size="sm">Small</ui-button>
                <ui-button size="md">Medium</ui-button>
                <ui-button size="lg">Large</ui-button>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3 text-gray-700">States</h3>
              <div class="space-y-3">
                <ui-button [disabled]="true">Disabled Button</ui-button>
                <ui-button [fullWidth]="true">Full Width Button</ui-button>
              </div>
            </div>
          </div>
        </ui-card>

        @if (lastClicked()) {
          <ui-card padding="sm" shadow="sm">
            <div class="bg-green-50 border border-green-200 rounded-md p-3">
              <p class="text-green-800 text-sm">
                Last clicked: <strong>{{ lastClicked() }}</strong>
              </p>
            </div>
          </ui-card>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected lastClicked = signal<string | null>(null);

  protected onButtonClick(buttonName: string): void {
    this.lastClicked.set(buttonName);
  }
}
