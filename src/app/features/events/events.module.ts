import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { ListEventComponent } from './list-event/list-event.component';
import { FormsModule } from '@angular/forms';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CardComponent } from './card/card.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    EventsComponent,
    ListEventComponent,
    EventDetailsComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    RouterModule,
    SharedModule
  ]
})
export class EventsModule { }
