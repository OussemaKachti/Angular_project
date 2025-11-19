import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css']
})
export class ParticipationFormComponent implements OnInit, OnDestroy {
  event?: Event;
  email = '';
  seats = 1;
  totalPrice = 0;
  loading = true;
  errorMessage = '';
  submitting = false;
  successMessage = '';
  private subscription?: Subscription;

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      const eventId = Number(params.get('id'));
      if (eventId) {
        this.fetchEvent(eventId);
      } else {
        this.loading = false;
        this.errorMessage = 'Identifiant de l’événement invalide.';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  fetchEvent(eventId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.dataService.getEventById(eventId).subscribe({
      next: event => {
        this.event = event;
        this.loading = false;
        this.updateTotal();
      },
      error: err => {
        this.errorMessage = err.message || 'Impossible de charger l’événement.';
        this.loading = false;
      }
    });
  }

  updateTotal(): void {
    const quantity = Number(this.seats);
    const unitPrice = this.event?.prix ?? 0;
    this.totalPrice = (isNaN(quantity) ? 0 : quantity) * unitPrice;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.event?.id) {
      this.errorMessage = 'Événement introuvable.';
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.dataService.participate(this.event.id, {
      email: this.email,
      seats: this.seats
    }).subscribe({
      next: () => {
        this.successMessage = 'Participation enregistrée avec succès !';
        form.resetForm({ email: '', seats: 1 });
        this.updateTotal();
        this.fetchEvent(this.event!.id); // refresh available seats
      },
      error: err => {
        this.errorMessage = err.message || 'Impossible d’enregistrer la participation.';
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}

