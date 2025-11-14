import { Component, OnInit } from '@angular/core';
import { Event } from '../../../models/event';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit {
  searchItem = "";
  listevent: Event[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.dataService.getEventList().subscribe({
      next: (events) => {
        this.listevent = events;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
      }
    });
  }

  isExpired(event: Event): boolean {
    return new Date(event.date) < new Date();
  }

  filter() {
    if (!this.searchItem) {
      return this.listevent;
    }
    return this.listevent.filter(eventItem => 
      eventItem.titre.toLowerCase().includes(this.searchItem.toLowerCase())
    );
  }

  onLikeNotification(event: Event) {
    console.log('Like notification for event:', event.titre);
    this.dataService.incrementLikes(event.id).subscribe({
      next: (updatedEvent) => {
        // Mettre à jour l'événement dans la liste
        const index = this.listevent.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          this.listevent[index] = updatedEvent;
        }
      },
      error: (error) => {
        console.error('Erreur lors du like:', error);
      }
    });
  }

  onBuyNotification(event: Event) {
    console.log('Buy notification for event:', event.titre);
    this.dataService.buyTicket(event.id).subscribe({
      next: (updatedEvent) => {
        // Mettre à jour l'événement dans la liste
        const index = this.listevent.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          this.listevent[index] = updatedEvent;
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'achat:', error);
      }
    });
  }











}
