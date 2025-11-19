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
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
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
  participate(eventId: number, payload: { email: string; seats: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/participations`, payload).pipe(
      catchError(this.handleError)
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
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  
}
