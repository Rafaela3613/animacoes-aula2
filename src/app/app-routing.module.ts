import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ListaTarefasComponent } from './lista-tarefas/lista-tarefas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listaTarefas',
    pathMatch: 'full',
  },
  {
    path: 'listaTarefas',
    component: ListaTarefasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

