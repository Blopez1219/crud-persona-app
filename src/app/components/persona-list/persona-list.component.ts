import { Component } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';

import * as bootstrap from 'bootstrap';
import * as Toastify from 'toastify-js';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss']
})
export class PersonaListComponent {
  personas: Persona[] = [];
  displayedPersonas: Persona[] = [];
  total:number = 0;

  personaId: number | null = null;
  selectedPersona: Persona | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5; // Número de filas por página
  totalPages: number = 1;

  searchText: string = '';
  filteredPersonas: Persona[] = [];

  constructor(
    private personaService: PersonaService
  )
  {}
  ngOnInit(): void {
    this.loadDataIntoTable();
  }

  private loadDataIntoTable(): void {
    this.personaService.getPersonas().subscribe((personas) => {
      this.personas = personas;
      this.filteredPersonas = [...this.personas]; // Copia inicial para el filtrado
      this.calculateTotal();
      this.totalPages = Math.ceil(this.total / this.itemsPerPage);
      this.updateDisplayedPersonas();
    });
  }

  private calculateTotal(): void {
    this.total = this.personas.length;
  }

  private updateDisplayedPersonas(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPersonas = this.filteredPersonas.slice(startIndex, endIndex);
  }

  goToPreviousPage(event: Event): void {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPersonas();
    }
  }

  goToNextPage(event: Event): void {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPersonas();
    }
  }

  applyFilter(): void {
    const lowerSearchText = this.searchText.toLowerCase();

    this.filteredPersonas = this.personas.filter((persona) =>
      Object.values(persona).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(lowerSearchText)
      )
    );

    this.total = this.filteredPersonas.length;
    this.totalPages = Math.ceil(this.total / this.itemsPerPage);
    this.updateDisplayedPersonas();
  }

  openModal(event: Event): void {
    event.preventDefault(); // Previene la navegación predeterminada del enlace

    const modalElement = document.getElementById('personaFormModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  openEditModal(event: Event,persona: Persona): void {
    event.preventDefault();
    this.personaId = persona.id;
    const modalElement = document.getElementById('personaFormModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  openInfoModal(persona: Persona): void {
    this.selectedPersona = persona; // Asignar la persona seleccionada

    const modalElement = document.getElementById('personaInfoModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  deletePersona(event: Event, id:number): void {
    event.preventDefault();
    this.personaService.deletePersona(id).subscribe(response => {
      this.showSuccessToast('Persona eliminada correctamente');

      this.personas = this.personas.filter(persona => persona.id !== id);

      this.applyFilter();
    })
  }

  private showSuccessToast(message: string): void {
      Toastify({
        text: message,
        close:true,
        gravity: 'top',
        position: 'center',
        stopOnFocus: true,
        style: {
          background: '#189586'
        }
      }).showToast();
    }

}
