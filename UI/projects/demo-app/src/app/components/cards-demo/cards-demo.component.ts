import { Component } from '@angular/core';

@Component({
  selector: 'app-cards-demo',
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.scss']
})
export class CardsDemoComponent {
  cardContent = {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    content: 'This is some sample content for the card. It demonstrates how the card component handles different types of content and layouts.',
    imageUrl: 'https://picsum.photos/400/200'
  };
}
