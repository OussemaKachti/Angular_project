import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { ListEventComponent } from './list-event/list-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { AddEventComponent } from './add-event/add-event.component';
import { ParticipationFormComponent } from './participation-form/participation-form.component';

const routes: Routes = [
  { path: '', component: EventsComponent,
    children: [
      {path:'',component:ListEventComponent},
      {path: 'add', component: AddEventComponent},
      {path: 'participate/:id', component: ParticipationFormComponent},
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
