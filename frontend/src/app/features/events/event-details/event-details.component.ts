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
        console.log('Event ID:', this.id);
        console.log('Event Details:', this.eventDetails);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
      }
    });
  }
}
