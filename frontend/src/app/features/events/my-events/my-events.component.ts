import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  private readonly ORGANISATEUR_ID = 1;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.loading = true;
    this.dataService.getEventsByOrganizerId(this.ORGANISATEUR_ID).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
        alert('Erreur lors du chargement de vos événements. Veuillez réessayer.');
        this.loading = false;
      }
    });
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/events', 'add', eventId]);
  }

  deleteEvent(eventId: number): void {
    console.log('deleteEvent called with eventId:', eventId);
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      console.log('User confirmed, sending DELETE request for eventId:', eventId);
      
      this.dataService.deleteEvent(eventId).subscribe({
        next: () => {
          console.log('Event deleted successfully');
          alert('Événement supprimé avec succès !');
          this.loadMyEvents(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          const errorMsg = error.error?.message || error.message || 'Erreur lors de la suppression de l\'événement.';
          alert('Erreur: ' + errorMsg + '\n\nVérifiez la console pour plus de détails.');
        }
      });
    }
  }
}

