import {Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.scss']
})
export class EmissionsComponent implements OnInit {
  public copy: string;

  cedentsList: any[] = [];
  tradeList: any[] = [];
  coinsList: any[] = [];
  clientsList: any[] = [];

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');
  coinsControl = new FormControl('');
  clientsControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredClients!: Observable<string[]>;

  emissionsFormGroup = this._formBuilder.group({
    ccedente: [''],
    cramo: [''],
    cmoneda: [''],
    xmoneda:[''],
    ccliente: [''],
    fdesde: [''],
    fhasta: [''],
  });

  constructor( private _formBuilder: FormBuilder,
                private http: HttpClient,
                private modalService: NgbModal,
                private snackBar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router,
                ) {}

  ngOnInit(): void {
    this.getCedents();
    this.getTrades();
    this.getCoins();
    this.getClients();
  }

  getCedents(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', null).subscribe((response: any) => {
      if (response.data.cedents) {
        for (let i = 0; i < response.data.cedents.length; i++) {
          this.cedentsList.push({
            id: response.data.cedents[i].ccedente,
            value: response.data.cedents[i].xcedente,
          });
        }
        this.filteredCedents = this.cedentsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCedents(value || ''))
        );
      }
    });
  }

  private _filterCedents(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cedentsList
      .map(cedent => cedent.value)
      .filter(cedent => cedent.toLowerCase().includes(filterValue));
  }

  getTrades(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/trade', null).subscribe((response: any) => {
      if (response.data.trade) {
        for (let i = 0; i < response.data.trade.length; i++) {
          this.tradeList.push({
            id: response.data.trade[i].cramo,
            value: response.data.trade[i].xramo,
          });
        }
        this.filteredTrade = this.tradeControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTrade(value || ''))
        );
      }
    });
  }

  private _filterTrade(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tradeList
      .map(trade => trade.value)
      .filter(trade => trade.toLowerCase().includes(filterValue));
  }

  getCoins(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/coins', null).subscribe((response: any) => {
      if (response.data.coins) {
        for (let i = 0; i < response.data.coins.length; i++) {
          this.coinsList.push({
            id: response.data.coins[i].cmoneda,
            value: response.data.coins[i].xmoneda,
          });
        }
        const selectedCoin = this.coinsList.find(coin => coin.id === 2);
        if (selectedCoin) {
            this.emissionsFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
            this.emissionsFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
        }

        this.filteredCoins = this.coinsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCoins(value || ''))
        );
      }
    });
  }

  private _filterCoins(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.coinsList
      .map(coins => coins.value)
      .filter(coins => coins.toLowerCase().includes(filterValue));
  }

  
  getClients(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/clients', null).subscribe((response: any) => {
      if (response.data.clients) {
        for (let i = 0; i < response.data.clients.length; i++) {
          this.clientsList.push({
            id: response.data.clients[i].ccliente,
            value: response.data.clients[i].xcliente,
          });
        }
        this.filteredClients = this.clientsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClients(value || ''))
        );
      }
    });
  }

  private _filterClients(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clientsList
      .map(clients => clients.value)
      .filter(clients => clients.toLowerCase().includes(filterValue));
  }

  calcularFechaHasta(event: any) {
    const fechaDesde = new Date(event.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.emissionsFormGroup.get('fhasta')?.setValue(fechaHastaISO);
  }

}
