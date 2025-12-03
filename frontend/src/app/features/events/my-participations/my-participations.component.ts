import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Participation } from '../../../models/participation';

@Component({
  selector: 'app-my-participations',
  templateUrl: './my-participations.component.html',
  styleUrls: ['./my-participations.component.css']
})
export class MyParticipationsComponent implements OnInit {
  participations: Participation[] = [];
  loading = true;
  private readonly USER_ID = 1;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadMyParticipations();
  }

  loadMyParticipations(): void {
    this.loading = true;
    this.dataService.getParticipationsByUserId(this.USER_ID).subscribe({
      next: (participations) => {
        console.log('Received participations:', participations);
        // Convertir les dates string en Date objects pour le pipe
        this.participations = participations.map((p, index) => {
          console.log(`=== Processing participation ${index} ===`);
          console.log('Raw participation object:', p);
          console.log('Participation ID (p.id):', p.id, 'Type:', typeof p.id);
          console.log('Event ID (p.event?.id):', p.event?.id, 'Type:', typeof p.event?.id);
          console.log('Full participation object:', JSON.stringify(p, null, 2));
          
          // Vérifier si l'ID de participation est correct
          if (!p.id) {
            console.error('ERROR: Participation ID is missing!', p);
          }
          if (p.id === p.event?.id) {
            console.error('ERROR: Participation ID equals Event ID! This is wrong!', {
              participationId: p.id,
              eventId: p.event?.id,
              fullObject: p
            });
          }
          
          // S'assurer que l'ID de participation est bien présent et différent de l'ID de l'événement
          const participationId = p.id;
          const eventId = p.event?.id;
          
          if (participationId === eventId) {
            console.error('CRITICAL ERROR: Participation ID matches Event ID. Cannot use this ID for deletion.');
          }
          
          const mapped = {
            ...p,
            id: participationId, // Utiliser explicitement l'ID de participation
            createdAt: p.createdAt,
            event: p.event ? {
              ...p.event,
              date: new Date(p.event.date)
            } : p.event
          };
          
          console.log('Mapped participation:', {
            participationId: mapped.id,
            eventId: mapped.event?.id,
            email: mapped.email,
            areIdsDifferent: mapped.id !== mapped.event?.id
          });
          return mapped;
        });
        console.log('Mapped participations:', this.participations);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des participations:', error);
        alert('Erreur lors du chargement de vos participations. Veuillez réessayer.');
        this.loading = false;
      }
    });
  }

  cancelParticipation(participationId: number | null | undefined): void {
    console.log('cancelParticipation called with participationId:', participationId);
    console.log('Type of participationId:', typeof participationId);
    console.log('Current participations:', this.participations);
    
    if (!participationId || participationId === null || participationId === undefined) {
      console.error('Invalid participation ID:', participationId);
      alert('Erreur: ID de participation invalide.');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir annuler cette participation ?')) {
      console.log('User confirmed, sending DELETE request for participationId:', participationId);
      console.log('URL will be:', `http://localhost:8082/api/participations/${participationId}`);
      
      // Vérifier que l'ID n'est pas l'ID de l'événement
      const participation = this.participations.find(p => p.id === participationId);
      
      if (!participation) {
        console.error('ERROR: Participation not found in list!', {
          participationId: participationId,
          allParticipations: this.participations.map(p => ({ id: p.id, eventId: p.event?.id }))
        });
        alert('Erreur: Participation introuvable dans la liste.');
        return;
      }
      
      if (participation.event && participation.id === participation.event.id) {
        console.error('ERROR: Participation ID matches Event ID! This is wrong!');
        console.error('Participation object:', participation);
        console.error('Participation ID:', participation.id);
        console.error('Event ID:', participation.event.id);
        alert('Erreur: L\'ID de participation (' + participation.id + ') est identique à l\'ID de l\'événement (' + participation.event.id + ').\n\nLe backend ne retourne peut-être pas correctement l\'ID de participation. Vérifiez les logs du backend.');
        return;
      }
      
      console.log('Verification passed: Participation ID (' + participationId + ') is different from Event ID (' + (participation?.event?.id || 'N/A') + ')');
      console.log('About to call deleteParticipation with ID:', participationId);
      console.log('Expected URL:', `http://localhost:8082/api/participations/${participationId}`);
      
      this.dataService.deleteParticipation(participationId).subscribe({
        next: () => {
          console.log('Participation deleted successfully');
          alert('Participation annulée avec succès !');
          this.loadMyParticipations(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          const errorMsg = error.error?.message || error.message || 'Erreur lors de l\'annulation de la participation.';
          alert('Erreur: ' + errorMsg + '\n\nVérifiez la console pour plus de détails.');
        }
      });
    }
  }
}

