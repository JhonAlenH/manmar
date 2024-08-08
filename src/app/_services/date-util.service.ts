import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {

  constructor() { }

  formatDate(date: any): string {
    if (!(date instanceof Date)) {
      throw new Error('El parámetro debe ser un objeto Date.');
    }

    // Obtiene el día, mes y año de la fecha
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
    const year = date.getFullYear();

    // Formatea el día y el mes para asegurarse de que tengan dos dígitos
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    // Retorna la fecha formateada
    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  adjustDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adjust date by adding 1 day
    return date.toISOString().split('T')[0]; // Convert back to YYYY-MM-DD format
  }
}
