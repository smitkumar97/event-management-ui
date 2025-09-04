import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EventData } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatIconModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss'
})

export class AddEvent {
  eventForm: FormGroup;
  eventId!: string | null;
  eventData = JSON.parse(localStorage.getItem('eventList') || '');

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private toaster: Toast) {
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
      let event = this.eventData.filter((element: EventData) => element.id == this.eventId);
      this.eventData = this.eventData.filter((element: EventData) => element.id !== this.eventId);
      this.eventForm.patchValue({
        title: event[0].title,
        date: this.convertTimestampToDateString(event[0].date),
        location: event[0].location,
        description: event[0].description
      });
    }
  }

  private convertTimestampToDateString(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const eventData: EventData = {
        id: this.eventId ? this.eventId : this.eventData.length + 1,
        title: formValue.title,
        date: formValue.date,
        location: formValue.location,
        description: formValue.description || ''
      };

      this.eventData = [...this.eventData, eventData];
      localStorage.setItem('eventList', JSON.stringify(this.eventData));
      if (this.eventId) {
        this.toaster.showSuccess('Event modified successfully.');
      } else {
        this.toaster.showSuccess('Event created successfully.');
      }
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
