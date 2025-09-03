import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { AddEvent } from './components/add-event/add-event';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'event',
        component: AddEvent
    },
    {
        path: 'event/:id',
        component: AddEvent
    },
];
