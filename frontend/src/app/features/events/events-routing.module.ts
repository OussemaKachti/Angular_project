import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { ListEventComponent } from './list-event/list-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { AddEventComponent } from './add-event/add-event.component';
import { ParticipationFormComponent } from './participation-form/participation-form.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyParticipationsComponent } from './my-participations/my-participations.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: EventsComponent,
    children: [
      {path:'',component:ListEventComponent},
      {path: 'add', component: AddEventComponent, canActivate: [authGuard]},
      {path: 'add/:id', component: AddEventComponent, canActivate: [authGuard]},
      {path: 'participate/:id', component: ParticipationFormComponent, canActivate: [authGuard]},
      {path: 'my-events', component: MyEventsComponent, canActivate: [authGuard]},
      {path: 'my-participations', component: MyParticipationsComponent, canActivate: [authGuard]},
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
