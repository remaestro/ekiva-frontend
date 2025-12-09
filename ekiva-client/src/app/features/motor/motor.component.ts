import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-motor',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './motor.component.html'
})
export class MotorComponent {}
