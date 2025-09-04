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

@Component({
  selector: 'app-dashboard',
  imports: [Calendar, MatRadioModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'

})

export class Dashboard implements AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'date', 'location', 'description', 'action'];
  dataSource: MatTableDataSource<EventData>;
  pageSizeOptions = [5, 10, 25, 100];
  eventData: any;
  viewMode: 'table' | 'calendar' = 'table';

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
}
