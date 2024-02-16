import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { PintsComponent } from './pints/pints.component';

export const routes: Routes = [
    { path: '', component: PintsComponent},
    { path: ':pintType/:pintName', component: DetailsComponent}
];
