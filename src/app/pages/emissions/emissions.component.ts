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
  currentUser!: any

  cedentsList: any[] = [];
  tradeList: any[] = [];
  coinsList: any[] = [];
  clientsList: any[] = [];
  takersList: any[] = [];

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');
  coinsControl = new FormControl('');
  clientsControl = new FormControl('');
  takersControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredClients!: Observable<string[]>;
  filteredTakers!: Observable<string[]>;

  containerAuto: boolean = false;
  containerSalud: boolean = false;

  emissionsFormGroup = this._formBuilder.group({
    ccedente: [''],
    xcedente: [''],
    cramo: [''],
    cmoneda: [''],
    xmoneda:[''],
    ccliente: [''],
    fdesde: [''],
    fhasta: [''],
    itipodoc: [''],
    xdoc_identificacion: [''],
    ctomador: [''],
    xtomador: [''],
    itipodoc_t: [''],
    xdoc_identificacion_t: [''],
    xpoliza: [''],
    msuma_aseg: [''],
    mprima: [''],
  });

  constructor( private _formBuilder: FormBuilder,
                private http: HttpClient,
                private modalService: NgbModal,
                private snackBar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router,
                ) {}

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    
    if(this.currentUser){
      this.getCedents();
      this.getTrades();
      this.getCoins();
      this.getClients();
      this.getTakers();
    }
  }

  formatWithSeparator(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    event.target.value = value;
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
        const selectedCedents = this.cedentsList.find(cedents => cedents.id === 73);
        if (selectedCedents) {
            this.emissionsFormGroup.get('ccedente')?.setValue(selectedCedents.id);
            this.emissionsFormGroup.get('xcedente')?.setValue(selectedCedents.value);
        }
        this.cedentsList.sort((a, b) => a.value > b.value ? 1 : -1)
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
        this.tradeList.sort((a, b) => a.value > b.value ? 1 : -1)
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

  onTradeSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedTrade = this.tradeList.find(trade => trade.value === selectedValue);
    if (selectedTrade) {
      this.emissionsFormGroup.get('cramo')?.setValue(selectedTrade.id);
    }

    if(selectedTrade.id == 18){
      console.log('si')
      this.containerAuto = true;
    }else{ this.containerAuto = false;}
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
        this.coinsList.sort((a, b) => a.value > b.value ? 1 : -1)
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
            itipo: response.data.clients[i].itipodoc,
            xdocu: response.data.clients[i].xdoc_identificacion,
          });
        }
        this.clientsList.sort((a, b) => a.value > b.value ? 1 : -1)
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

  getTakers(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/clients', null).subscribe((response: any) => {
      if (response.data.clients) {
        for (let i = 0; i < response.data.clients.length; i++) {
          this.takersList.push({
            id: response.data.clients[i].ccliente,
            value: response.data.clients[i].xcliente,
            itipo: response.data.clients[i].itipodoc,
            xdocu: response.data.clients[i].xdoc_identificacion,
          });
        }
        this.takersList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredTakers = this.takersControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTakers(value || ''))
        );
      }
    });
  }

  private _filterTakers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.takersList
      .map(takers => takers.value)
      .filter(takers => takers.toLowerCase().includes(filterValue));
  }

  calcularFechaHasta(event: any) {
    const fechaDesde = new Date(event.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.emissionsFormGroup.get('fhasta')?.setValue(fechaHastaISO);
  }

  onClientSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedClients = this.clientsList.find(client => client.value === selectedValue);
    if (selectedClients) {
      this.emissionsFormGroup.get('ccliente')?.setValue(selectedClients.id);
      this.emissionsFormGroup.get('itipodoc')?.setValue(selectedClients.itipo);
      this.emissionsFormGroup.get('xdoc_identificacion')?.setValue(selectedClients.xdocu);

      this.emissionsFormGroup.get('ctomador')?.setValue(selectedClients.id);
      this.emissionsFormGroup.get('xtomador')?.setValue(selectedClients.value);
      this.emissionsFormGroup.get('itipodoc_t')?.setValue(selectedClients.itipo);
      this.emissionsFormGroup.get('xdoc_identificacion_t')?.setValue(selectedClients.xdocu);
    }
  }

  onTakersSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedTakers = this.takersList.find(takers => takers.value === selectedValue);
    if (selectedTakers) {
      this.emissionsFormGroup.get('ctomador')?.setValue(selectedTakers.id);
      this.emissionsFormGroup.get('xtomador')?.setValue(selectedTakers.value);
      this.emissionsFormGroup.get('itipodoc_t')?.setValue(selectedTakers.itipo);
      this.emissionsFormGroup.get('xdoc_identificacion_t')?.setValue(selectedTakers.xdocu);
    }
  }

}
