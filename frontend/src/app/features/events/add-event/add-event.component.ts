import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { futurDateValidator } from '../../../shared/validators/futur-date.validator';
import { DataService } from '../../../shared/services/data.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'] 
})
export class AddEventComponent implements OnInit {

  eventForm!: FormGroup;
  isEditMode = false;
  eventId?: number;
  private readonly ORGANISATEUR_ID = 1;

  constructor(
    private dataService: DataService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(30)
      ]),
      date: new FormControl('', [Validators.required, futurDateValidator(5)]),

      lieu: new FormControl('', Validators.required),
      prix: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$')
      ]),
      imageUrl: new FormControl(''),
      nbPlaces: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]?$|^100$')
      ]),
      domaines: new FormArray([
        new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ]),
      detailedAddress: new FormGroup({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2)
        ]),
        governorate: new FormControl('', [
          Validators.required,
          Validators.minLength(2)
        ]),
        zipcode: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{4}$')
        ])
      })
    });

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.eventId = +id;
        this.loadEventForEdit(this.eventId);
      }
    });
  }

  loadEventForEdit(id: number): void {
    this.dataService.getEventById(id).subscribe({
      next: (event) => {
        // Remplir le formulaire avec les données de l'événement
        this.eventForm.patchValue({
          title: event.titre,
          description: event.description,
          date: this.formatDateForInput(event.date),
          lieu: event.lieu,
          prix: event.prix,
          imageUrl: event.imageUrl,
          nbPlaces: event.nbPlaces
        });

        // Remplir les domaines
        const domainesArray = this.eventForm.get('domaines') as FormArray;
        domainesArray.clear();
        if (event.domaines && event.domaines.length > 0) {
          event.domaines.forEach(domain => {
            domainesArray.push(new FormControl(domain, [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(20)
            ]));
          });
        } else {
          domainesArray.push(new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]));
        }

        // Remplir l'adresse détaillée
        if (event.detailedAddress) {
          this.eventForm.get('detailedAddress')?.patchValue({
            street: event.detailedAddress.street,
            city: event.detailedAddress.city,
            governorate: event.detailedAddress.governorate,
            zipcode: event.detailedAddress.zipcode
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
        alert('Erreur lors du chargement de l\'événement. Veuillez réessayer.');
        this.router.navigate(['/events']);
      }
    });
  }

  formatDateForInput(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  get title (){return this.eventForm.get('title')}

  get domaines(): FormArray {
    return this.eventForm.get('domaines') as FormArray;
  }

  addDomain(): void {
    this.domaines.push(
      new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])
    );
  }

  get detailedAddress(): FormGroup {
    return this.eventForm.get('detailedAddress') as FormGroup;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.domaines.controls.forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.eventForm.value;
    const eventData: Event = {
      id: this.isEditMode && this.eventId ? this.eventId : 0,
      titre: formValue.title,
      description: formValue.description,
      date: formValue.date ? new Date(formValue.date) : new Date(),
      lieu: formValue.lieu,
      prix: parseFloat(formValue.prix),
      organisateurId: this.ORGANISATEUR_ID,
      imageUrl: formValue.imageUrl || 'images/event.png',
      nbPlaces: parseInt(formValue.nbPlaces, 10),
      nbrLikes: 0, // Sera ignoré en mode édition car on ne met pas à jour les likes
      domaines: (formValue.domaines || []).filter((domain: string) => domain && domain.trim().length > 0),
      detailedAddress: formValue.detailedAddress
    };

    if (this.isEditMode && this.eventId) {
      // Mode édition
      this.dataService.updateEvent(this.eventId, eventData).subscribe({
        next: (updatedEvent) => {
          console.log('Événement modifié:', updatedEvent);
          alert('Événement modifié avec succès !');
          this.router.navigate(['/events/my-events']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification de l\'événement:', error);
          alert('Erreur lors de la modification de l\'événement. Veuillez réessayer.');
        }
      });
    } else {
      // Mode création
      this.dataService.addEventToBackend(eventData).subscribe({
        next: (savedEvent) => {
          console.log('Événement créé:', savedEvent);
          alert('Événement créé avec succès !');
          this.router.navigate(['/events/my-events']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'événement:', error);
          alert('Erreur lors de la création de l\'événement. Veuillez réessayer.');
        }
      });
    }
  }
}