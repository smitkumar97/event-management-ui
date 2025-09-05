import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { EventData } from '../../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { createNewUser } from '../../utils/utils';
import { Toast } from '../../services/toast';
import { Calendar } from '../calendar/calendar';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  imports: [Calendar, MatRadioModule, MatDatepickerModule, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'

})

export class Dashboard implements AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'date', 'location', 'description', 'action'];
  dataSource: MatTableDataSource<EventData>;
  pageSizeOptions = [5, 10, 25, 100];
  eventData: any;
  viewMode: 'table' | 'calendar' = 'table';
  readonly rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private toaster: Toast) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadEventData();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.title.toLowerCase().includes(filter) || data.location.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEventData(): void {
    const storedData = localStorage.getItem('eventList');

    if (!storedData || storedData === '') {
      this.eventData = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
      localStorage.setItem('eventList', JSON.stringify(this.eventData));
    } else {
      this.eventData = JSON.parse(storedData);
    }

    this.dataSource.data = this.eventData;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDateFilter() {
    if ((this.rangeForm.controls.start.valid && this.rangeForm.controls.start.value) && (this.rangeForm.controls.end.value && this.rangeForm.controls.end.value)) {
      const start = new Date(this.rangeForm.controls.start.value).setHours(0, 0, 0, 0);
      const end = new Date(this.rangeForm.controls.end.value).setHours(23, 59, 59, 999);

      this.dataSource.data = this.eventData.filter((event: EventData) => {
        const eventDate = new Date(event.date).getTime();
        return eventDate >= start && eventDate <= end;
      });
    } else {
      this.dataSource.data = this.eventData;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  addData() {
    this.router.navigate(['./event']);
  }

  removeData(event: EventData) {
    this.eventData = this.eventData.filter((element: EventData) => element.id !== event.id);
    localStorage.setItem('eventList', JSON.stringify(this.eventData));
    this.dataSource.data = this.eventData;
    this.toaster.showSuccess('Event removed successfully.');
  }

  editEvent(event: EventData) {
    this.router.navigate(['./event', event.id]);
  }

  switchView(event: MatRadioChange) {
    this.viewMode = event.value;
  }

  resetDates() {
    this.rangeForm.reset();
    this.applyDateFilter();
  }
}
