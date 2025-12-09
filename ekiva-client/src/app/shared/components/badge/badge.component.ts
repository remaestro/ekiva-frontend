import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: '<span [class]="badgeClasses"><ng-content></ng-content></span>',
  styles: [':host { display: inline-block; }']
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() rounded = false;

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const variantClasses = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-cyan-100 text-cyan-800',
      neutral: 'bg-gray-100 text-gray-600'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    const roundedClass = this.rounded ? 'rounded-full' : 'rounded';

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${roundedClass}`;
  }
}
