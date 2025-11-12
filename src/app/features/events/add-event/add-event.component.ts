import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private dataService: DataService, private router: Router) {}

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

    const savedEvent = this.dataService.addEvent(newEvent);
    this.router.navigate(['/events', savedEvent.id]);
  }
}