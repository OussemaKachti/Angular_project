import { Injectable } from '@angular/core';
import { Event } from '../../models/event';
import { ListEventComponent } from '../../features/events/list-event/list-event.component';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  listevent: Event[] = [
    {
      id: 1,
      titre: "Concert Jazz",
      description: "Un concert exceptionnel avec des artistes internationaux.",
      date: new Date("2024-10-15T20:00:00"),
      lieu: "Théâtre Municipal",
      prix: 50,
      organisateurId: 101,
      imageUrl: "images/event.png",
      nbPlaces: 200,
      nbrLikes: 35
    },
    {
      id: 2,
      titre: "Conférence Tech IA",
      description: "Discussion autour des dernières tendances en intelligence artificielle.",
      date: new Date("2025-11-02T09:00:00"),
      lieu: "Centre de Congrès",
      prix: 0,
      organisateurId: 102,
      imageUrl: "images/event.png",
      nbPlaces: 500,
      nbrLikes: 120
    },
    {
      id: 3,
      titre: "Atelier Cuisine",
      description: "Apprenez à préparer des plats traditionnels tunisiens.",
      date: new Date("2025-12-05T14:30:00"),
      lieu: "Espace Culturel",
      prix: 25,
      organisateurId: 103,
      imageUrl: "images/event.png",
      nbPlaces: 5,
      nbrLikes: 48
    },
    {
      id: 4,
      titre: "Marathon Carthage",
      description: "Une course sportive à travers les sites historiques.",
      date: new Date("2026-01-20T07:00:00"),
      lieu: "Carthage",
      prix: 10,
      organisateurId: 104,
      imageUrl: "images/event.png",
      nbPlaces: 1000,
      nbrLikes: 300
    }
  ];

  constructor() { }

  getEventById(id: number): Event | undefined {
    return this.listevent.find(event => event.id === id);
  }
  
  getEventList(): Event[] {
    return this.listevent;
  }
}
