import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event } from '../../models/event';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les événements
  getEventList(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map(events => events.map(event => this.mapEvent(event))),
      catchError(this.handleError)
    );
  }

  // Récupérer un événement par ID
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      map(event => this.mapEvent(event)),
      catchError(this.handleError)
    );
  }

  // Créer un nouvel événement
  addEvent(event: Event): Observable<Event> {
    // Convertir la date en format ISO pour le backend
    const eventToSend = {
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    };
    
    return this.http.post<Event>(this.apiUrl, eventToSend).pipe(
      map(event => this.mapEvent(event)),
      catchError(this.handleError)
    );
  }

  // Mettre à jour un événement
  updateEvent(id: number, event: Event): Observable<Event> {
    const eventToSend = {
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    };
    
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventToSend).pipe(
      map(event => this.mapEvent(event)),
      catchError(this.handleError)
    );
  }

  // Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('DataService: Deleting event at URL:', url);
    console.log('DataService: Event ID:', id);
    
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('DataService: Error deleting event:', error);
        console.error('DataService: Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url
        });
        return this.handleError(error);
      })
    );
  }

  // Rechercher des événements
  searchEvents(searchTerm: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`).pipe(
      map(events => events.map(event => this.mapEvent(event))),
      catchError(this.handleError)
    );
  }

  // Incrémenter les likes
  incrementLikes(id: number): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/like`, {}).pipe(
      map(event => this.mapEvent(event)),
      catchError(this.handleError)
    );
  }

  // Acheter un ticket
  buyTicket(id: number): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/buy`, {}).pipe(
      map(event => this.mapEvent(event)),
      catchError(this.handleError)
    );
  }

  // Participer à un événement
  participate(eventId: number, payload: { email: string; seats: number; userId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/participations`, payload).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les événements par organisateur
  getEventsByOrganizerId(organisateurId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organizer/${organisateurId}`).pipe(
      map(events => events.map(event => this.mapEvent(event))),
      catchError(this.handleError)
    );
  }

  // Ajouter un événement au backend (alias pour addEvent)
  addEventToBackend(event: Event): Observable<Event> {
    return this.addEvent(event);
  }

  // Récupérer les participations par userId
  getParticipationsByUserId(userId: number): Observable<any[]> {
    const url = `${environment.apiUrl}/participations/user/${userId}`;
    console.log('DataService: Getting participations from URL:', url);
    
    return this.http.get<any[]>(url).pipe(
      map(participations => {
        console.log('DataService: Received participations:', participations);
        participations.forEach((p, index) => {
          console.log(`DataService: Participation ${index}:`, {
            id: p.id,
            email: p.email,
            eventId: p.event?.id,
            fullObject: p
          });
        });
        return participations;
      }),
      catchError(this.handleError)
    );
  }

  // Ajouter une participation au backend
  addParticipationToBackend(eventId: number, email: string, seats: number, userId: number): Observable<any> {
    const payload = { email, seats, userId };
    const url = `${this.apiUrl}/${eventId}/participations`;
    console.log('DataService: Sending participation request to:', url);
    console.log('DataService: Full URL:', url);
    console.log('DataService: Payload:', JSON.stringify(payload));
    console.log('DataService: Environment API URL:', environment.apiUrl);
    
    return this.http.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error) => {
        console.error('DataService: HTTP Error caught:', error);
        return this.handleError(error);
      })
    );
  }

  // Supprimer une participation
  deleteParticipation(participationId: number): Observable<void> {
    const url = `${environment.apiUrl}/participations/${participationId}`;
    console.log('DataService: Deleting participation at URL:', url);
    console.log('DataService: Participation ID:', participationId);
    
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('DataService: Error deleting participation:', error);
        console.error('DataService: Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url
        });
        return this.handleError(error);
      })
    );
  }

  // Mapper l'événement reçu du backend vers le format Angular
  private mapEvent(event: any): Event {
    return {
      ...event,
      date: new Date(event.date) // Convertir la string en Date
    };
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      const status = error.status;
      switch (status) {
        case 400:
          errorMessage = error.error?.message || 'Requête invalide. Veuillez vérifier vos données.';
          break;
        case 404:
          errorMessage = 'Ressource introuvable.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = error.error?.message || `Erreur ${status}: ${error.message}`;
      }
    }
    
    console.error('Erreur HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }

  
}
