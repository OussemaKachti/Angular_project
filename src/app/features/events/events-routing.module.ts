import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { ListEventComponent } from './list-event/list-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';

const routes: Routes = [
  { path: '', component: EventsComponent,
    children: [
      {path:'',component:ListEventComponent},
      {path: ':id',component: EventDetailsComponent},
    ]
   },
  { path: 'list', component: ListEventComponent },
  { path: '**', component: EventsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
