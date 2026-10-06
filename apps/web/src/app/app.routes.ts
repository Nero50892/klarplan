import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'Rechner',
    loadComponent: () => import('./rechner/rechner').then((m) => m.Rechner),
  },
  {
    path: 'tilgungsplan',
    title: 'Tilgungsplan',
    loadComponent: () =>
      import('./tilgungsplan/tilgungsplan').then((m) => m.Tilgungsplan),
  },
  {
    path: 'vergleich',
    title: 'Vergleich',
    loadComponent: () => import('./vergleich/vergleich').then((m) => m.Vergleich),
  },
  {
    path: 'hinweis',
    title: 'Hinweis',
    loadComponent: () => import('./hinweis/hinweis').then((m) => m.Hinweis),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
