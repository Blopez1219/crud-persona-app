import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from 'src/app/services/persona.service';

import * as bootstrap from 'bootstrap';
import * as Toastify from 'toastify-js';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss']
})
export class PersonaFormComponent{
  personaForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    last_name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    birthdate: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
  })

  @Input() personaId: number | null = null;



  constructor(
    private personaService: PersonaService,
    private router: Router,
    private route: ActivatedRoute,

  ){

  }


  ngOnChanges(): void {
    if (this.personaId) {
      this.loadDataIntoForm();
    }
  }

  savePersona(): void {

    if (this.personaForm.valid) {
      if(this.personaId){
        this.personaService.updatePersona(this.personaId, this.personaForm.value).subscribe({

          next: (persona) => {
            this.showSuccessToast('Persona actualizada correctamente');
          this.closeModal();

          setTimeout(() => {
            window.location.reload();
          }, 2000);
          },
          error: (err) => {
            console.error('Error al guardar la persona:', err);
            // Puedes mostrar un mensaje de error al usuario si lo deseas
          },

        });
      } else {
        this.personaService.createPersona(this.personaForm.value).subscribe({
          next: (persona) => {
            this.showSuccessToast('Persona guardada correctamente');
            this.closeModal();

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error: (err) => {
            console.error('Error al guardar la persona:', err);
            // Puedes mostrar un mensaje de error al usuario si lo deseas
          }
        });
      }

    } else {
      // Si el formulario no es válido, marca los controles como tocados para mostrar errores
      this.personaForm.markAllAsTouched();
    }
  }

  hasError(field:string): boolean {
    const errorsObject = this.personaForm.get(field)?.errors ?? {};
    const errors = Object.keys(errorsObject);

    if(
      errors.length && (this.personaForm.get(field)?.touched ||
      this.personaForm.get(field)?.dirty )
    ){
      return true;
    }

    return false;
  }

  getCurrentError(field: string): string {
    const errorsObject = this.personaForm.get(field)?.errors ?? {};
    const errors = Object.keys(errorsObject);

    if(!errors)
      return '';

    return errors[0];
  }

  getFormTitle(): string {
    return this.personaId ? 'Editar Persona' : 'Nueva Persona';
  }

  private loadDataIntoForm(): void{
    console.log(this.personaId)
    if(this.personaId){
      this.personaService.getPersona(this.personaId).subscribe(persona => {
        console.log(persona)
        this.personaForm.patchValue(persona);
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('personaFormModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
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
