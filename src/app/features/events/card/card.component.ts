import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() event!: Event;
  @Output() notifLike = new EventEmitter<Event>();
  @Output() notifBuy = new EventEmitter<Event>();

  incrLikes(event: Event): void {
    event.nbrLikes++;
    this.notifLike.emit(event);
  }

  buyTicket(event: Event): void {
    if (event.nbPlaces > 0) {
      event.nbPlaces--;
      this.notifBuy.emit(event);
    }
  }

  isExpired(event: Event): boolean {
    return new Date(event.date) < new Date();
  }
}
