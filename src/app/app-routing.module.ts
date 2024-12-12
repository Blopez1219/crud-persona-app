import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaListComponent } from './components/persona-list/persona-list.component';

const routes: Routes = [
  {path: 'personas', component: PersonaListComponent},
  {path: '**', redirectTo: 'personas', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
