import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute, 
    private dataService: DataService,
    private router: Router
  ) {}

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

  private readonly USER_ID = 1;

  onSubmit(form: NgForm): void {
    console.log('onSubmit called');
    console.log('Form valid:', form.valid);
    console.log('Form errors:', form.errors);
    console.log('Email:', this.email);
    console.log('Seats:', this.seats);
    console.log('Event:', this.event);

    if (form.invalid) {
      console.log('Form is invalid, marking all as touched');
      form.control.markAllAsTouched();
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        console.log(`Control ${key}:`, {
          valid: control.valid,
          errors: control.errors,
          touched: control.touched
        });
      });
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    if (!this.event?.id) {
      console.error('Event ID is missing');
      this.errorMessage = 'Événement introuvable.';
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const participationData = {
      email: this.email,
      seats: this.seats,
      userId: this.USER_ID
    };

    console.log('Sending participation request:', {
      eventId: this.event.id,
      ...participationData
    });

    this.dataService.addParticipationToBackend(
      this.event.id,
      this.email,
      this.seats,
      this.USER_ID
    ).subscribe({
      next: (response) => {
        console.log('Participation created successfully:', response);
        this.successMessage = 'Participation enregistrée avec succès !';
        setTimeout(() => {
          this.router.navigate(['/events/my-participations']);
        }, 1500);
      },
      error: err => {
        console.error('Error creating participation:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message,
          url: err.url
        });
        let errorMsg = "Impossible d'enregistrer la participation.";
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
        this.errorMessage = errorMsg;
        this.submitting = false;
        alert('Erreur: ' + errorMsg + '\n\nVérifiez la console pour plus de détails.');
      },
      complete: () => {
        console.log('Request completed');
        this.submitting = false;
      }
    });
  }
}

