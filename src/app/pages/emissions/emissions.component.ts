import {Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
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
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public copy: string;
  currentUser!: any
  bcv!: any;

  cedentsList: any[] = [];
  tradeList: any[] = [];
  coinsList: any[] = [];
  clientsList: any[] = [];
  takersList: any[] = [];
  methodOfPaymentList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');
  coinsControl = new FormControl('');
  clientsControl = new FormControl('');
  takersControl = new FormControl('');
  methodOfPaymentControl = new FormControl('');
  stateControl = new FormControl('');
  cityControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredClients!: Observable<string[]>;
  filteredTakers!: Observable<string[]>;
  filteredMethodOfPayment!: Observable<string[]>;
  filteredState!: Observable<string[]>;
  filteredCity!: Observable<string[]>;

  containerAuto: boolean = false;
  containerSalud: boolean = false;
  takersInfo: boolean = false;
  insuredInfo: boolean = false;
  WhatsApp: boolean = false;
  ActivaSumBs: boolean = false;
  ActivaPriBs: boolean = false;

  someParamValue = 'Valor de ejemplo';
  receiptData = {};
  fdesde: any;
  msuma_aseg: any;
  msuma_aseg_bs: any;

  emissionsFormGroup = this._formBuilder.group({
    ccedente: [''],
    xcedente: [''],
    cramo: [''],
    cmoneda: [''],
    xmoneda:[''],
    ccliente: [''],
    xcliente: [''],
    fdesde: [''],
    fhasta: [''],
    itipodoc: [''],
    xdoc_identificacion: [''],
    ctomador: [''],
    xtomador: [''],
    itipodoc_t: [''],
    xdoc_identificacion_t: [''],
    xprofesion: [''],
    xrif: [''],
    xdomicilio: [''],
    cpais: [''],
    xpais: [''],
    cestado: [''],
    xestado: [''],
    cciudad: [''],
    xciudad: [''],
    xzona_postal: [''],
    xdireccion: [''],
    xcorreo: [''],
    xcorreo_asegurado: [''],
    xpoliza: [''],
    msuma_aseg: [''],
    msuma_aseg_bs: [''],
    mprima: ['0,00'],
    mprima_bs: [''],
    cmetodologiapago: [''],
    xmetodologiapago: [''],
    xtelefono_asegurado: [''],
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

    fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv')
    .then((response) => response.json())
    .then(data => {
      this.bcv = data.monitors.usd.price;
    });

    if(this.currentUser){
      this.getCedents();
      this.getTrades();
      this.getCoins();
      this.getClients();
      this.getTakers();
      this.getMethodOfPayment()
      this.getState();
    }
  }

  formatWithSeparator(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    event.target.value = value;

    const numericValue = Number(value.replace(/\./g, ''));
    this.msuma_aseg = numericValue;
  }

  formatPrima(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    event.target.value = value;
    this.emissionsFormGroup.get('mprima')?.setValue(event.target.value)
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

  searchTakers(){
    let data = {
      xcedula: this.emissionsFormGroup.get('xdoc_identificacion')?.value
    }
    console.log(data)
    this.http.get(environment.apiUrl + `/api/v1/valrep/takers/${data.xcedula}`).subscribe((response: any) => {
      if(response.status){
        if(response.data.ctomador){
          this.emissionsFormGroup.get('ctomador')?.setValue(response.data.ctomador);
          this.emissionsFormGroup.get('xtomador')?.setValue(response.data.xtomador);
          this.emissionsFormGroup.get('itipodoc_t')?.setValue(response.data.icedula);
          this.emissionsFormGroup.get('xdoc_identificacion_t')?.setValue(response.data.xcedula);
        }else{
          console.log('epaaaa')
        }

      }
    })
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

      // this.containerAuto = true;
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
    const lista = this.clientsList.map(clients => clients.value).filter(clients => clients.toLowerCase().includes(filterValue));;
  
    if(!lista[0]){
      this.emissionsFormGroup.get('xcliente')?.setValue(filterValue)
      if(this.emissionsFormGroup.get('xcliente')?.value){
        this.validateClient();
      }
    }

    return lista
  }

  getTakers(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/takers', null).subscribe((response: any) => {
      if (response.data.takers) {
        for (let i = 0; i < response.data.takers.length; i++) {
          this.takersList.push({
            id: response.data.takers[i].ctomador,
            value: response.data.takers[i].xtomador,
            itipo: response.data.takers[i].icedula,
            xdocu: response.data.takers[i].xcedula,
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
    const lista = this.takersList.map(taker => taker.value).filter(taker => taker.toLowerCase().includes(filterValue));;
  
    if(!lista[0]){
      this.emissionsFormGroup.get('xtomador')?.setValue(filterValue)
      if(this.emissionsFormGroup.get('xtomador')?.value){
        this.validateTaker();
      }
    }

    return lista
  }

  validateClient(){
    if(this.emissionsFormGroup.get('xcliente')?.value){
      if(this.emissionsFormGroup.get('ccliente')?.value){
        this.emissionsFormGroup.get('xcliente')?.setValue('')
        this.insuredInfo = false;
      }else{
        this.insuredInfo = true;
      }
    }
  }

  validateTaker(){
    if(this.emissionsFormGroup.get('xtomador')?.value){
      if(this.emissionsFormGroup.get('ctomador')?.value){
        this.emissionsFormGroup.get('xtomador')?.setValue('')
        this.takersInfo = false;
      }else{
        this.takersInfo = true;
      }
    }
  }

  calcularFechaHasta(event: any) {
    const fechaDesde = new Date(event.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.emissionsFormGroup.get('fhasta')?.setValue(fechaHastaISO);
    this.fdesde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());
  }

  onClientSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedClients = this.clientsList.find(client => client.value === selectedValue);
    if (selectedClients) {
      this.emissionsFormGroup.get('ccliente')?.setValue(selectedClients.id);
      this.emissionsFormGroup.get('xcliente')?.setValue(selectedClients.value);
      this.emissionsFormGroup.get('itipodoc')?.setValue(selectedClients.itipo);
      this.emissionsFormGroup.get('xdoc_identificacion')?.setValue(selectedClients.xdocu);
      this.searchTakers()
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

  getMethodOfPayment(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/method-of-payment', null).subscribe((response: any) => {
      if (response.data.payment) {
        for (let i = 0; i < response.data.payment.length; i++) {
          this.methodOfPaymentList.push({
            id: response.data.payment[i].cmetodologiapago,
            value: response.data.payment[i].xmetodologiapago,
          });
        }
        const selectedMe = this.methodOfPaymentList.find(method => method.id === 5);
        if (selectedMe) {
            this.emissionsFormGroup.get('cmetodologiapago')?.setValue(selectedMe.id);
            this.emissionsFormGroup.get('xmetodologiapago')?.setValue(selectedMe.value);
        }
        this.methodOfPaymentList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredMethodOfPayment = this.methodOfPaymentControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterMethodOfPayment(value || ''))
        );
      }
    });
  }

  private _filterMethodOfPayment(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.methodOfPaymentList
      .map(payment => payment.value)
      .filter(payment => payment.toLowerCase().includes(filterValue));
  }

  onMethodOfPaymentSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedMet = this.methodOfPaymentList.find(met => met.value === selectedValue);
    if (selectedMet) {
      this.emissionsFormGroup.get('cmetodologiapago')?.setValue(selectedMet.id);
      this.receipt()
    }
  }

  getState(){
    let data = {
      cpais: 58
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/state', data).subscribe((response: any) => {
      if (response.data.state) {
        this.stateList = response.data.state.map((state: any) => ({
          id: state.cestado,
          value: state.xestado
        }));

        const selectedState = this.stateList.find(state => state.id === 1);
        if (selectedState) {
          this.emissionsFormGroup.get('cestado')?.setValue(selectedState.id);
          this.emissionsFormGroup.get('xestado')?.setValue(selectedState.value);
          this.getCity();
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredState = this.stateControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterState(value || ''))
        );
      }
    });
  }

  private _filterState(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.stateList
      .map(state => state.value)
      .filter(state => state.toLowerCase().includes(filterValue));
  }

  onStateSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedState = this.stateList.find(state => state.value === selectedValue);
    if (selectedState) {
      this.emissionsFormGroup.get('cestado')?.setValue(selectedState.id);
      this.getCity();
    }
  }

  getCity(){
    let data = {
      cpais: 58,
      cestado: this.emissionsFormGroup.get('cestado')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/city', data).subscribe((response: any) => {
      if (response.data.city) {
        this.cityList = response.data.city.map((city: any) => ({
          id: city.cciudad,
          value: city.xciudad
        }));
        this.filteredCity = this.cityControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCity(value || ''))
        );
      }
    });
  }

  private _filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cityList
      .map(city => city.value)
      .filter(city => city.toLowerCase().includes(filterValue));
  }

  onCitySelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCity = this.cityList.find(city => city.value === selectedValue);
    if (selectedCity) {
      this.emissionsFormGroup.get('cciudad')?.setValue(selectedCity.id);
    }
  }

  rif(){
    const itipodoc_t = this.emissionsFormGroup.get('itipodoc_t')?.value;
    const xdoc_identificacion_t = this.emissionsFormGroup.get('xdoc_identificacion_t')?.value;

    this.emissionsFormGroup.get('xrif')?.setValue(itipodoc_t + '-' + xdoc_identificacion_t);
  }

  SumBs() {
    const mprima = parseFloat(this.emissionsFormGroup.get('mprima')?.value);
    
    const msuma_aseg_bs = this.msuma_aseg * this.bcv;
    const mprima_bs = mprima * this.bcv;

    const formattedMsumaAsegBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(msuma_aseg_bs);

    const formattedPriBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(mprima_bs);
  
    this.emissionsFormGroup.get('msuma_aseg_bs')?.setValue(formattedMsumaAsegBs);
    this.emissionsFormGroup.get('mprima_bs')?.setValue(formattedPriBs);
    
    if(msuma_aseg_bs != 0){
      this.ActivaSumBs = true;
    }

    if(mprima_bs != 0){
      this.ActivaPriBs = true;
    }

    if(msuma_aseg_bs != 0 && mprima_bs != 0){
      this.receipt()
    }
  }

  receipt() {
    const {
      ccedente, cramo, cmoneda, ccliente, xcliente, fdesde, fhasta, itipodoc, 
      xdoc_identificacion, ctomador, xtomador, itipodoc_t, xdoc_identificacion_t, 
      xprofesion, xrif, xdomicilio, cpais, cestado, cciudad, xzona_postal,
      xdireccion, xcorreo, xcorreo_asegurado, xpoliza, msuma_aseg, msuma_aseg_bs, 
      mprima, mprima_bs, cmetodologiapago, xtelefono_asegurado
    } = this.emissionsFormGroup.value;
  
    if (cramo && fdesde && fhasta && mprima && cmetodologiapago) {
      this.containerAuto = true;
      this.receiptData = {
        fdesde: fdesde,
        fhasta: fhasta,
        cmetodologiapago: cmetodologiapago,
        cramo: cramo,
        ccedente: ccedente,
        cmoneda: cmoneda,
        ccliente: ccliente,
        xcliente: xcliente,
        itipodoc: itipodoc,
        xdoc_identificacion: xdoc_identificacion,
        ctomador: ctomador,
        xtomador: xtomador,
        itipodoc_t: itipodoc_t,
        xdoc_identificacion_t: xdoc_identificacion_t,
        xprofesion: xprofesion,
        xrif: xrif,
        xdomicilio: xdomicilio,
        cpais: cpais,
        cestado: cestado,
        cciudad: cciudad,
        xzona_postal: xzona_postal,
        xdireccion: xdireccion,
        xcorreo: xcorreo,
        xcorreo_asegurado: xcorreo_asegurado,
        xpoliza: xpoliza,
        msuma_aseg: msuma_aseg,
        xtelefono_asegurado: xtelefono_asegurado,
        msuma: msuma_aseg_bs,
        msumaext: this.msuma_aseg,
        mprima: mprima_bs,
        mprimaext: mprima,
      }
    } else {
      this.containerAuto = false;
    }
  }

  activateWhatsApp(){
    this.WhatsApp = true;
  }

  sendWhatsAppMessage() {
    const telefono = this.emissionsFormGroup.get('xtelefono_asegurado')?.value;
    if (telefono) {
      const url = `https://wa.me/${telefono}`;
      window.open(url, '_blank');
    }
  }

}
