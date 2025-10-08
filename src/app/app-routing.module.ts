import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
    {path:'' , redirectTo:"home",pathMatch:"full"},
  {path:'home' , component:HomeComponent},
    { path: 'events', loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule) },
    { path: 'tickets', loadChildren: () => import('./features/tickets/tickets.module').then(m => m.TicketsModule) },
  // {path:'/:id',component:DetailEventComponent},
  {path:'**' , component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
