import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() footerContent?: string;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() hoverable = false;
  @Input() bordered = true;

  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-lg transition-all duration-200';
    
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8'
    };

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };

    const borderClass = this.bordered ? 'border border-gray-200' : '';
    const hoverClass = this.hoverable ? 'hover:shadow-lg hover:-translate-y-1' : '';

    return `${baseClasses} ${paddingClasses[this.padding]} ${shadowClasses[this.shadow]} ${borderClass} ${hoverClass}`;
  }
}
