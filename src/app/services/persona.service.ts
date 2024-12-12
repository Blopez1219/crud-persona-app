import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private readonly API_URL = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
  ) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.API_URL}/personas`);
  }

  getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.API_URL}/personas/${id}`);
  }

  createPersona(persona: Persona): Observable<Persona> {
    console.log('createPersona', JSON.stringify(persona));
    return this.http.post<Persona>(`${this.API_URL}/personas`, persona);
  }

  updatePersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.API_URL}/personas/${id}`, persona);
  }

  deletePersona(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/personas/${id}`);
  }
}
