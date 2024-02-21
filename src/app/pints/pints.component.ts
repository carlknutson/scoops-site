import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, RouterOutlet } from '@angular/router';

import { PINTS } from '../data';
import { PintType } from '../pint';

@Component({
  selector: 'app-pints',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterOutlet, RouterModule],
  templateUrl: './pints.component.html',
  styleUrl: './pints.component.css'
})
export class PintsComponent {
  pints = PINTS

  getImageUrl(pintType: PintType, urlName:string){
    return `assets/${pintType}/${urlName}/recipe.jpg`
  }

  getPintTypeCardLabel(pintType: PintType){
    if (pintType == PintType.iceCream) {
      return "Ice Cream"
    } else if (pintType == PintType.sorbet) {
      return "Sorbet"
    }
    return pintType
  }
}
