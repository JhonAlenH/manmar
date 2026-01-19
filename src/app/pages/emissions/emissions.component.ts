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
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from '../../_services/date-util.service'
import Swal from 'sweetalert2'
;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmissionsComponent implements OnInit {
  clientDifferent = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public copy: string;
  currentUser!: any
  bcv!: any;
  cmoneda: string = 'Bs.'

  cedentsList: any[] = [];
  tradeList: any[] = [];
  productList: any[] = [];
  coinsList: any[] = [];
  clientsList: any[] = [];
  takersList: any[] = [];
  methodOfPaymentList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  insuranceList: any[] = [];

  newAsegurado:boolean = false
  newTomador:boolean = false

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');
  productControl = new FormControl('');
  coinsControl = new FormControl('');
  clientsControl = new FormControl('');
  takersControl = new FormControl('');
  methodOfPaymentControl = new FormControl('');
  stateControl = new FormControl('');
  cityControl = new FormControl('');
  insuranceControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;
  filteredProduct!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredClients!: Observable<string[]>;
  filteredTakers!: Observable<string[]>;
  filteredMethodOfPayment!: Observable<string[]>;
  filteredState!: Observable<string[]>;
  filteredCity!: Observable<string[]>;
  filteredInsurance!: Observable<string[]>;

  containerAuto: boolean = false;
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
  comisionProducto: any;
  
  clientDataComponent = {
    title: 'Crear Nuevo Cliente',
    mode: 'create',
    mainUrl: '/api/v1/maestros/clientes/get/',
    createUrl: '/api/v1/maestros/clientes/create', 
    formId: 'create_clientes',
    fields: [      
      {
        type: 'text',
        fieldName: 'Nombre', class: 'col-md-6',
        required: true,
        key: 'xnombre',
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Apellido', class: 'col-md-6',
        required: false,
        key: 'xapellido',
        bdType: 'text'
      },
      {
        type: 'simple-select',
        fieldName: 'Identificacion', class: 'col-md-1',
        required: true,
        values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
        key: 'itipodoc',
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Cedula', class: 'col-md-2',
        required: true,
        key: 'cci_rif',
        bdType: 'text'
      },
      {
        type: 'date',
        fieldName: 'Fecha Nacimiento', class: 'col-md-3',
        required: false,
        key: 'fnacimiento',
        bdType: 'text'
      },
      { 
        type: 'select',
        fieldName: 'País', class: 'col-md-2',
        required: false,
        url: '/api/v1/maestros/paises',
        binding_change_fields: ['cestado'],
        change_fields: ['cestado', 'cciudad'],
        key: 'cpais',
        bdType: 'number'
      },
      {
        type: 'select',
        fieldName: 'Estado', class: 'col-md-2',
        required: false,
        key: 'cestado',
        url_id: 'cpais',
        binding_change_fields: ['cciudad'],
        change_fields: ['cciudad'],
        url: '/api/v1/maestros/estados',
        bdType: 'number'
      },
      {
        type: 'select',
        fieldName: 'Ciudad', class: 'col-md-2',
        required: false,
        key: 'cciudad',
        url_id: 'cestado',
        url: '/api/v1/maestros/ciudades',
        bdType: 'number'
      },
      {
        type: 'simple-select',
        fieldName: 'Estado Civil', class: 'col-md-2',
        required: false,
        values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Soltero', value: 'S'}, {text: 'Casado', value: 'C'}, {text: 'Divorciado', value: 'D'}, {text: 'N/A', value: 'N'}], 
        key: 'iestado_civil',
        bdType: 'text'
      },
      {
        type: 'simple-select',
        fieldName: 'Sexo', class: 'col-md-2',
        required: false,
        values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Femenino', value: 'F'}, {text: 'Masculino', value: 'M'}, {text: 'N/A', value: 'N'}], 
        key: 'isexo',
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Teléfono', class: 'col-md-2',
        required: false,
        key: 'xtelefono',
        bdType: 'text'
      },
      {
        type: 'email',
        fieldName: 'Correo', class: 'col-md-6',
        required: false,
        key: 'xcorreo',
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Direccion', class: 'col-md-6',
        required: false,
        key: 'xdireccion',
        bdType: 'text'
      }
    ]
  }

  emissionsFormGroup = this._formBuilder.group({
    ccedente: [''],
    xcedente: [''],
    cramo: [''],
    cproducto: [''],
    cmoneda: [''],
    xmoneda:[''],
    ccliente: [''],
    xcliente: [''],
    casegurado: [''],
    xasegurado: [''],
    xcedula: [''],
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
    mprima: [''],
    mprima_bs: [''],
    cmetodologiapago: [''],
    xmetodologiapago: [''],
    xtelefono_asegurado: [''],
  });

  constructor( private _formBuilder: FormBuilder,
    private http: HttpClient,
    private dateUtilService: DateUtilService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
  ) {
    dateAdapter.setLocale('es');
    fetch('https://ve.dolarapi.com/v1/dolares')
    .then((response) => response.json())
    .then(data => {
      data.forEach((item: any) => {
        if (item.fuente === 'oficial') {
          this.bcv = Number((item.promedio).toFixed(2));
        }
      });
    })
    .catch(error => {
      console.error('Error al obtener la tasa del BCV:', error);
      // Continuar con el valor predeterminado de `this.bcv`
    })
  }

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    const jsonD = JSON.parse(storedSession);
    this.currentUser = jsonD.data?.user

    this.emissionsFormGroup.get('itipodoc')?.disable();
    this.emissionsFormGroup.get('xcedula')?.disable();

    this.emissionsFormGroup.get('itipodoc_t')?.disable();
    this.emissionsFormGroup.get('xdoc_identificacion_t')?.disable();

    if (!this.bcv) {
      fetch('https://apisys2000.lamundialdeseguros.com/api/v1/valrep/tasaBCV')
      .then((response) => response.json())
      .then(data => {
        data.data.forEach((item: any) => {
          if (item.cmoneda === '$') {
            this.bcv = Number((item.ptasamon).toFixed(2));
          }
        });
      })
      .catch(error => {
      });
    }

    if(this.currentUser){
      this.getCedents();
      this.getTrades();
      this.getCoins();
      this.getMethodOfPayment()
      this.getClients();
    }
  }

  checkClickOutside(event:any, item:any) {
    if (event.srcElement.id == 'item-create') {
      this[item] = false
    }
  }

  unFormatWithSeparator(value: any) {
    let valueF = value.replace('.', '');
    valueF = valueF.replace(',', '.');
    valueF = Number(valueF)
    valueF = parseFloat(valueF.toFixed(2));
    return valueF;
  }

  checkFormat(event: any, field:any) {
    let value = this.formatWithSeparator(event.target.value);

    this.emissionsFormGroup.get(field)?.setValue(value);
  }
  formatWithSeparator(valueTo: any) {
    let value = valueTo.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    const formattedValue = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return formattedValue
  }

  getCedents(){
    this.cedentsList = []
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', {
      cproductor: this.currentUser?.productor?.cproductor
    }).subscribe((response: any) => {
      if (response.data.cedents) {
        for (let i = 0; i < response.data.cedents.length; i++) {
          this.cedentsList.push({
            id: response.data.cedents[i].ccedente,
            value: `${response.data.cedents[i].persona?.xnombre} ${response.data.cedents[i].persona?.xapellido || ''}`.trim(),
          });
        }
        const selectedCedents = this.cedentsList.find(cedents => cedents.id === 60);
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

  onCedentsSelection(event: any) {
    const selectedValue = event.option.value;
    const selected= this.cedentsList.find(cedent => cedent.value === selectedValue);
    if (selected) {
      this.emissionsFormGroup.get('ccedente')?.setValue(selected.id);
      this.emissionsFormGroup.get('xcedente')?.setValue(selected.value);
    }
  }

  searchTakers(){
    let data = {
      xcedula: this.emissionsFormGroup.get('xcedula')?.value
    }
    this.http.get(environment.apiUrl + `/api/v1/valrep/takers/${data.xcedula}`).subscribe((response: any) => {
      if(response.status){
        if(response.data.ctomador){
          this.emissionsFormGroup.get('ctomador')?.setValue(response.data.ctomador);
          this.emissionsFormGroup.get('xtomador')?.setValue(response.data.xtomador);
          this.emissionsFormGroup.get('itipodoc_t')?.setValue(response.data.icedula);
          this.emissionsFormGroup.get('xdoc_identificacion_t')?.setValue(response.data.xcedula);
        }else{
        }

      }
    })
  }

  getTrades(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/trade', null).subscribe((response: any) => {
      this.tradeList = []
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
      this.getProduct();
    }
  }

  getProduct(){
    let data = {
      cramo: this.emissionsFormGroup.get('cramo')?.value,
      ccedente: this.emissionsFormGroup.get('ccedente')?.value,
    }
    this.productList = []
    this.http.post(environment.apiUrl + '/api/v1/valrep/product', data).subscribe((response: any) => {
      if (response.data.product) {
        for (let i = 0; i < response.data.product.length; i++) {
          this.productList.push({
            id: response.data.product[i].cproducto,
            value: response.data.product[i].xproducto,
          });
        }
        this.productList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredProduct = this.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterProduct(value || ''))
        );
      }
    });
  }

  private _filterProduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productList
      .map(product => product.value)
      .filter(product => product.toLowerCase().includes(filterValue));
  }

  onProductSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedProduct = this.productList.find(product => product.value === selectedValue);
    if (selectedProduct) {
      this.emissionsFormGroup.get('cproducto')?.setValue(selectedProduct.id);
    }

    this.getTariffs();
  }

  getTariffs(){
    let data = {
      id: this.emissionsFormGroup.get('cproducto')?.value,
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/tariffs`, data).subscribe((response: any) => {
      if(response.status){
        this.comisionProducto = response.pcomision;
        
        if(!this.comisionProducto){
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un Error",
            text: "Estimado usuario, no exite arancel por el ramo y por la cedente, por ende no se puede calcular las comisiones.",
            confirmButtonText: "<strong>Aceptar</strong>",
            confirmButtonColor: "#5e72e4",
          }).then((result) => {
              if (result.isConfirmed) {
                  // location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
              }
          });
        }
      }
    },(err) => {

    })
  }

  searchPolicy(){
    const poliza = this.emissionsFormGroup.get('xpoliza')?.value
    this.http.post(environment.apiUrl + `/api/v1/emission/policy/${poliza}`, {ccedente: this.emissionsFormGroup.get('ccedente')?.value}).subscribe((response: any) => {
      if(response.status){
        if(response.xpoliza){
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un Error",
            text: response.message,
            confirmButtonText: "<strong>Aceptar</strong>",
            confirmButtonColor: "#5e72e4",
          }).then((result) => {
              if (result.isConfirmed) {
                  // location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
              }
          });
        }

      }
    })
  }

  getCoins(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/coins', null).subscribe((response: any) => {
      this.coinsList = []
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
  onCoinSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCoin = this.coinsList.find(coin => coin.value === selectedValue);
    if (selectedCoin) {
      this.emissionsFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
      this.emissionsFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
    }
  }

  private _filterCoins(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.coinsList
      .map(coins => coins.value)
      .filter(coins => coins.toLowerCase().includes(filterValue));
  }

  checkCreation() {
    setTimeout(() => {
      this.getClients()
    }, 500);
  }

  getClients(){
    console.log('obtengo')
    this.http.post(environment.apiUrl + '/api/v1/valrep/clients', null).subscribe((response: any) => {
      this.insuranceList = []
      this.takersList = []
      if (response.data.clients) {
        for (const client of response.data.clients) {
          this.insuranceList.push({
            id: client.cpersona,
            value: `${`${client.xnombre} ${client.xapellido || ''}`.trim()} (${client.cci_rif})`,
            xdocu: client.cci_rif
          });
          this.takersList.push({
            id: client.cpersona,
            value: `${`${client.xnombre} ${client.xapellido || ''}`.trim()} (${client.cci_rif})`,
            xdocu: client.cci_rif
          });
        }
        
        this.insuranceList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.takersList.sort((a, b) => a.value > b.value ? 1 : -1)

        this.filteredInsurance = this.insuranceControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterInsurance(value || ''))
        );
        this.filteredTakers = this.takersControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTakers(value || ''))
        );
      }
    });
  }

  private _filterInsurance(value: string): string[] {
    const filterValue = value.toLowerCase();
    const lista = this.insuranceList.map(insurance => insurance.value).filter(insurance => insurance.toLowerCase().includes(filterValue));;
  
    if(!lista[0]){
      this.emissionsFormGroup.get('xasegurado')?.setValue(filterValue)
      if(this.emissionsFormGroup.get('xasegurado')?.value){
        this.validateInsurance();
      }
    }

    return lista
  }

  onInsuranceSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedinsurance = this.insuranceList.find(insurance => insurance.value === selectedValue);
    if (selectedinsurance) {
      this.emissionsFormGroup.get('casegurado')?.setValue(selectedinsurance.id);
      this.emissionsFormGroup.get('xasegurado')?.setValue(selectedinsurance.value);
      this.emissionsFormGroup.get('itipodoc')?.setValue(selectedinsurance.itipo);
      this.emissionsFormGroup.get('xcedula')?.setValue(selectedinsurance.xdocu);
      // this.searchTakers()
    }
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

  validateInsurance(){
    if(this.emissionsFormGroup.get('xasegurado')?.value){
      if(this.emissionsFormGroup.get('casegurado')?.value){
        this.emissionsFormGroup.get('xasegurado')?.setValue('')
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
      this.methodOfPaymentList = []
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

  rif(){
    const itipodoc_t = this.emissionsFormGroup.get('itipodoc_t')?.value;
    const xdoc_identificacion_t = this.emissionsFormGroup.get('xdoc_identificacion_t')?.value;

    this.emissionsFormGroup.get('xrif')?.setValue(itipodoc_t + '-' + xdoc_identificacion_t);
  }

  SumBs() {
    const mprima = this.unFormatWithSeparator(this.emissionsFormGroup.get('mprima')?.value || '0,00');
    const msuma_aseg = this.unFormatWithSeparator(this.emissionsFormGroup.get('msuma_aseg')?.value || '0,00');

    let msuma_aseg_bs = msuma_aseg
    let mprima_bs = mprima
    
    if(this.emissionsFormGroup.get('cmoneda')?.value != '1') {
      msuma_aseg_bs = msuma_aseg * this.bcv;
      mprima_bs = mprima * this.bcv;
    }

    const formattedMsumaAsegBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(msuma_aseg_bs);

    const formattedPriBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(mprima_bs);
    
    this.emissionsFormGroup.get('msuma_aseg_bs')?.setValue(formattedMsumaAsegBs || '0,00');
    this.emissionsFormGroup.get('mprima_bs')?.setValue(formattedPriBs || '0,00');
    
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
    this.containerAuto = false;
    let {
      ccedente, cramo, cproducto, cmoneda, fdesde, fhasta, ctomador, casegurado,
      xpoliza, msuma_aseg, msuma_aseg_bs, mprima, mprima_bs, cmetodologiapago
    } = this.emissionsFormGroup.getRawValue();

    
    if (cramo && fdesde && fhasta && mprima && cmetodologiapago) {
      mprima = this.unFormatWithSeparator(mprima)
      msuma_aseg = this.unFormatWithSeparator(msuma_aseg)
      const mprimaNumeric = Number(mprima);
      const mcomision = mprimaNumeric * this.comisionProducto / 100;

      this.containerAuto = true;
      this.receiptData = {
        fdesde: fdesde,
        fhasta: fhasta,
        cmetodologiapago: cmetodologiapago,
        cramo: cramo,
        cproducto: cproducto,
        ccedente: ccedente,
        cmoneda: cmoneda,
        casegurado: casegurado,
        ctomador: ctomador,
        xpoliza: xpoliza,
        msuma: msuma_aseg_bs,
        msumaext: msuma_aseg,
        mprima: mprima_bs,
        mprimaext: mprima,
        pcomision: this.comisionProducto,
        bcv: this.bcv,
        mcomision: mcomision
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
