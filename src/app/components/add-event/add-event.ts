import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';

import { EventData } from '../../models/event.model';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-add-event',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss'
})

export class AddEvent {
  eventForm: FormGroup;
  eventId!: string | null;
  eventData = JSON.parse(localStorage.getItem('eventList') || '');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: Toast
  ) {
    this.eventForm = this.createForm();
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.eventId) {
      const event = this.eventData.find((e: EventData) => e.id == this.eventId);
      if (event) {
        this.eventData = this.eventData.filter((e: EventData) => e.id !== this.eventId);

        this.eventForm.patchValue({
          title: event.title,
          date: new Date(event.date),
          location: event.location,
          description: event.description,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const eventData: EventData = {
        id: this.eventId ? this.eventId : this.eventData.length + 1,
        title: formValue.title,
        date: formValue.date instanceof Date ? formValue.date.getTime() : formValue.date,
        location: formValue.location,
        description: formValue.description || ''
      };

      this.eventData = [eventData, ...this.eventData];
      localStorage.setItem('eventList', JSON.stringify(this.eventData));

      this.toaster.showSuccess(
        this.eventId ? 'Event modified successfully.' : 'Event created successfully.'
      );

      this.eventForm.reset();
      this.navigateBackToHome();
    } else {
      this.markFormGroupTouched(this.eventForm);
    }
  }

  navigateBackToHome() {
    this.router.navigate(['']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  get location() { return this.eventForm.get('location'); }
  get description() { return this.eventForm.get('description'); }
}
