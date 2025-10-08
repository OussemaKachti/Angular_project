import { Component, EventEmitter } from '@angular/core';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent {
  searchItem =""
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
    prix: 0, // gratuit
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

incrLikes (event:Event) {
  return event.nbrLikes++
}

buyTicket (event:Event ) {
  return event.nbPlaces--

}

isExpired (event: Event) {
 return new Date (event.date) < new Date();
  
}

filter()
{
return this.listevent.filter(eventItem=>eventItem.titre.toLowerCase().includes(this.searchItem.toLowerCase()));
// eventItem.lieu.toLowerCase().includes(this.searchItem.toLowerCase())
}











}
