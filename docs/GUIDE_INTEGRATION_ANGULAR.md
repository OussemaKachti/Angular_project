# Guide d'Intégration Angular avec le Backend Spring Boot

## 📋 Vue d'ensemble

Ce guide vous montre comment modifier votre projet Angular pour consommer l'API REST du backend Spring Boot au lieu des données locales.

---

## 🎯 Étape 1 : Installer HttpClient

HttpClient est déjà inclus dans Angular, mais il faut l'importer dans le module.

### 1.1 Vérifier l'import dans `app.module.ts`

Ouvrez `src/app/app.module.ts` et assurez-vous que `HttpClientModule` est importé :

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    // ... autres imports
    HttpClientModule
  ],
  // ...
})
export class AppModule { }
```

---

## 🎯 Étape 2 : Créer un Service d'Environnement

### 2.1 Créer les fichiers d'environnement

Créez `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Créez `src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://votre-serveur-production:8080/api'
};
```

### 2.2 Mettre à jour `angular.json`

Assurez-vous que les fichiers d'environnement sont configurés dans `angular.json` :

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

---

## 🎯 Étape 3 : Modifier le DataService

Remplacez le contenu de `src/app/shared/services/data.service.ts` :

```typescript
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
```

---

## 🎯 Étape 4 : Modifier les Composants

### 4.1 Modifier `ListEventComponent`

Modifiez `src/app/features/events/list-event/list-event.component.ts` :

```typescript
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
```

### 4.2 Modifier `EventDetailsComponent`

Modifiez `src/app/features/events/event-details/event-details.component.ts` :

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../../models/event';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  id!: number;
  eventDetails: Event | undefined;

  constructor(
    private actRoute: ActivatedRoute, 
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id') ? 
              parseInt(this.actRoute.snapshot.paramMap.get('id')!) : 0;
    
    this.dataService.getEventById(this.id).subscribe({
      next: (event) => {
        this.eventDetails = event;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
      }
    });
  }
}
```

### 4.3 Modifier `AddEventComponent`

Modifiez la méthode `onSubmit()` dans `src/app/features/events/add-event/add-event.component.ts` :

```typescript
onSubmit(): void {
  if (this.eventForm.invalid) {
    this.eventForm.markAllAsTouched();
    this.domaines.controls.forEach(control => control.markAsTouched());
    return;
  }

  const formValue = this.eventForm.value;
  const newEvent: Event = {
    id: 0,
    titre: formValue.title,
    description: formValue.description,
    date: formValue.date ? new Date(formValue.date) : new Date(),
    lieu: formValue.lieu,
    prix: parseFloat(formValue.prix),
    organisateurId: 0,
    imageUrl: formValue.imageUrl || 'images/event.png',
    nbPlaces: parseInt(formValue.nbPlaces, 10),
    nbrLikes: 0,
    domaines: (formValue.domaines || []).filter((domain: string) => domain && domain.trim().length > 0),
    detailedAddress: formValue.detailedAddress
  };

  this.dataService.addEvent(newEvent).subscribe({
    next: (savedEvent) => {
      console.log('Événement créé:', savedEvent);
      this.router.navigate(['/events', savedEvent.id]);
    },
    error: (error) => {
      console.error('Erreur lors de la création de l\'événement:', error);
      alert('Erreur lors de la création de l\'événement. Veuillez réessayer.');
    }
  });
}
```

### 4.4 Modifier `CardComponent`

Modifiez `src/app/features/events/card/card.component.ts` pour utiliser les méthodes du service :

```typescript
// Les méthodes incrLikes et buyTicket peuvent rester telles quelles
// car elles émettent des événements qui sont gérés par le parent
// Mais si vous voulez les appeler directement depuis le service :

import { DataService } from '../../../shared/services/data.service';

// Dans le constructeur
constructor(private dataService: DataService) {}

// Modifier incrLikes si nécessaire
incrLikes(event: Event): void {
  this.dataService.incrementLikes(event.id).subscribe({
    next: (updatedEvent) => {
      this.event = updatedEvent;
      this.notifLike.emit(updatedEvent);
    },
    error: (error) => {
      console.error('Erreur lors du like:', error);
    }
  });
}

buyTicket(event: Event): void {
  if (event.nbPlaces > 0) {
    this.dataService.buyTicket(event.id).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        this.notifBuy.emit(updatedEvent);
      },
      error: (error) => {
        console.error('Erreur lors de l\'achat:', error);
      }
    });
  }
}
```

---

## 🎯 Étape 5 : Tester l'Intégration

### 5.1 Démarrer le Backend

```bash
cd events-backend
./mvnw spring-boot:run
```

### 5.2 Démarrer Angular

```bash
cd myProject
ng serve
```

### 5.3 Vérifier

1. Ouvrez `http://localhost:4200`
2. Vérifiez que les événements se chargent depuis le backend
3. Testez la création d'un nouvel événement
4. Testez les fonctionnalités de like et d'achat

---

## 🐛 Résolution de Problèmes

### Erreur CORS

Si vous avez des erreurs CORS, vérifiez :
1. Que le backend a bien la configuration CORS
2. Que l'URL dans `environment.ts` est correcte
3. Que le backend est bien démarré sur le port 8080

### Erreur 404

Vérifiez :
1. Que l'URL de l'API est correcte
2. Que les endpoints du backend correspondent
3. Que le backend est bien démarré

### Erreur de format de date

Le backend envoie des dates au format ISO string. Le service les convertit automatiquement en objets Date JavaScript.

---

## ✅ Checklist de Vérification

- [ ] HttpClientModule importé dans app.module.ts
- [ ] Fichiers d'environnement créés
- [ ] DataService modifié pour utiliser HttpClient
- [ ] ListEventComponent modifié
- [ ] EventDetailsComponent modifié
- [ ] AddEventComponent modifié
- [ ] Backend démarré et accessible
- [ ] Angular démarre sans erreur
- [ ] Les événements se chargent depuis le backend
- [ ] La création d'événement fonctionne
- [ ] Les likes et achats fonctionnent

---

## 🎉 Félicitations !

Votre application Angular est maintenant connectée au backend Spring Boot. Les données sont persistées dans la base de données et toutes les opérations CRUD fonctionnent via l'API REST.

