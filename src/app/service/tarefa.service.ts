import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Tarefa } from '../interface/tarefa';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly API = 'http://localhost:3000/tarefas';
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  tarefas$ = this.tarefasSubject.asObservable();

  constructor(private http: HttpClient) {}

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      _order: 'desc',
    });
    this.http.get<Tarefa[]>(this.API, { params }).subscribe((tarefas) =>{
      let tarefasTemp = this.tarefasSubject.getValue();
      tarefasTemp = tarefasTemp.concat(tarefas)
      this.tarefasSubject.next(tarefasTemp);
    })
  }

  criar(tarefa: Tarefa): void {
    this.http.post<Tarefa>(this.API, tarefa).subscribe(novaTarefa => {
      const tarefas = this.tarefasSubject.getValue();
      tarefas.unshift(novaTarefa)
      this.tarefasSubject.next(tarefas);
    });
  }

  editar(tarefa: Tarefa, atualizarSubject: boolean): void {
    this.http.put<Tarefa>(`${this.API}/${tarefa.id}`, tarefa).subscribe(tarefaEditada => {
      if(atualizarSubject){
        const tarefas = this.tarefasSubject.getValue();
        const index = tarefas.findIndex(t => t.id === tarefaEditada.id);
        if (index !== -1) {
          tarefas[index] = tarefaEditada;
          this.tarefasSubject.next(tarefas);
        }
      }
    });
  }

  excluir(id: number): void {
    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      const tarefas = this.tarefasSubject.getValue();
      const index = tarefas.findIndex(t => t.id === id);
      if (index !== -1) {
        tarefas.splice(index, 1);
        this.tarefasSubject.next(tarefas);
      }
    });
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): void {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    return this.editar(tarefa, false);
  }
}
