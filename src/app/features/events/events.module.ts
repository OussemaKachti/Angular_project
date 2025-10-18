import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { ListEventComponent } from './list-event/list-event.component';
import { FormsModule } from '@angular/forms';
import { EventDetailsComponent } from './event-details/event-details.component';


@NgModule({
  declarations: [
    EventsComponent,
    ListEventComponent,
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    RouterModule
  ]
})
export class EventsModule { }
