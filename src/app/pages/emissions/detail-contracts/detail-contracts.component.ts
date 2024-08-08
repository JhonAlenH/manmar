import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from '../../../_services/date-util.service'
import Swal from 'sweetalert2'

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
  selector: 'app-detail-contracts',
  templateUrl: './detail-contracts.component.html',
  styleUrls: ['./detail-contracts.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DetailContractsComponent implements OnInit {
  bcv!: any;

  currentUser!: any
  ramo!: any;
  asegurado!: any;
  tomador!: any;
  id!: any;
  fdesde!: any;
  msuma_aseg!: any;
  msuma_aseg_bs!: any;
  mprima_bs!: any;
  edit: boolean = true;
  primaAlterada: boolean = false;
  metodologia!: any;
  cmetodologia!: any;

  cedentsList: any[] = [];
  coinsList: any[] = [];
  methodOfPaymentList: any[] = [];
  receiptList: any[] = [];

  cedentsControl = new FormControl('');
  coinsControl = new FormControl('');
  methodOfPaymentControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredMethodOfPayment!: Observable<string[]>;

  detailFormGroup = this._formBuilder.group({
    ccedente: [{ value: '', disabled: true }],
    xcedente: [{ value: '', disabled: true }],
    cmoneda: [{ value: '', disabled: true }],
    xmoneda: [{ value: '', disabled: true }],
    fdesde: [{ value: '', disabled: true }],
    fhasta: [{ value: '', disabled: true }],
    xpoliza: [{ value: '', disabled: true }],
    msuma_aseg: [{ value: '', disabled: true }],
    mprima: [{ value: '', disabled: true }],
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
                if(this.router.getCurrentNavigation().extras.state == undefined){
                  this.router.navigate(['search-contract']);
                }else{
                  this.id = this.router.getCurrentNavigation().extras.state.id;       
                  this.fdesde = this.router.getCurrentNavigation().extras.state.fdesde_pol;  
                }
                dateAdapter.setLocale('es');
                
               }

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);

    fetch('https://ve.dolarapi.com/v1/dolares')
    .then((response) => response.json())
    .then(data => {
      const banco = data.map((item: any) => {
        if(item.fuente == 'oficial'){
          this.bcv = item.promedio
        }
      })
    });
  
    if (this.id && this.currentUser) {
      this.values();
      this.getCedents();
      this.getCoins();
    } 
  }

  values(){
    this.http.post(environment.apiUrl + `/api/v1/emission/detail/${this.id}`, {}).subscribe((response: any) => {
      this.ramo = response.data.xramo;
      this.asegurado = response.data.xnombre;
      this.tomador = response.data.xtomador;
      this.msuma_aseg_bs = parseFloat(response.data.msuma);
      this.mprima_bs = response.data.mprima;
      this.metodologia = response.data.xmetodologiapago
      this.cmetodologia = response.data.cmetodologia

      this.detailFormGroup.get('fdesde')?.setValue(this.dateUtilService.adjustDate(response.data.fdesde_pol))
      this.detailFormGroup.get('ccedente')?.setValue(response.data.ccedente)
      this.detailFormGroup.get('xcedente')?.setValue(response.data.xcedente)
      this.detailFormGroup.get('cmoneda')?.setValue(response.data.cmoneda)
      this.detailFormGroup.get('xmoneda')?.setValue(response.data.xmoneda)
      this.detailFormGroup.get('xpoliza')?.setValue(response.data.xpoliza)
      this.detailFormGroup.get('msuma_aseg')?.setValue(this.formatNumber(response.data.msumaext));
      this.detailFormGroup.get('mprima')?.setValue(this.formatNumber(response.data.mprimaext));

      this.calcularFechaHasta();
    })
  }

  formatNumber(value: number | string): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getCedents(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', null).subscribe((response: any) => {
      if (response.data.cedents) {
        this.cedentsList = response.data.cedents.map((item: any) => ({
          id: item.ccedente,
          value: item.xcedente,
        }))

        const selectedCedents = this.cedentsList.find(cedents => cedents.id === this.detailFormGroup.get('ccedente')?.value);
        if (selectedCedents) {
            this.detailFormGroup.get('ccedente')?.setValue(selectedCedents.id);
            this.detailFormGroup.get('xcedente')?.setValue(selectedCedents.value);
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

  onCedentSelection(event: any) {
    const selectedValue = event.option.value;
    const selected = this.cedentsList.find(cedents => cedents.value === selectedValue);
    if (selected) {
      this.detailFormGroup.get('ccedente')?.setValue(selected.id);
      this.detailFormGroup.get('xcedente')?.setValue(selected.value);
    }
  }

  getCoins(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/coins', null).subscribe((response: any) => {
      if (response.data.coins) {
        this.coinsList = response.data.coins.map((item: any) => ({
          id: item.cmoneda,
          value: item.xmoneda,
        }))
        const selectedCoin = this.coinsList.find(coin => coin.id === this.detailFormGroup.get('cmoneda')?.value);
        if (selectedCoin) {
            this.detailFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
            this.detailFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
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

  onCoinSelection(event: any) {
    const selectedValue = event.option.value;
    const selected = this.coinsList.find(coins => coins.value === selectedValue);
    if (selected) {
      this.detailFormGroup.get('cmoneda')?.setValue(selected.id);
      this.detailFormGroup.get('xmoneda')?.setValue(selected.value);
    }
  }

  receipt() {
    let dataCompleta = {
      id: this.id,
      fdesde: this.detailFormGroup.get('fdesde')?.value,
      mprima: this.detailFormGroup.get('mprima')?.value,
    }
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt-update', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.data.receipt.map((item: any) => ({
          fdesde_rec: this.dateUtilService.formatDate(new Date(item.fdesde)),
          fhasta_rec: this.dateUtilService.formatDate(new Date(item.fhasta)),
          mprima: item.mprima.toFixed(2),
        }));
      }
    })
  }

  calcularFechaHasta() {
    const fechaDesde = new Date(this.detailFormGroup.get('fdesde')?.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.detailFormGroup.get('fhasta')?.setValue(fechaHastaISO);
    this.fdesde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());
  }

  editContract(){
    this.edit = false
    this.detailFormGroup.get('fdesde')?.enable();
    this.detailFormGroup.get('fhasta')?.enable();
    this.detailFormGroup.get('ccedente')?.enable();
    this.detailFormGroup.get('xcedente')?.enable();
    this.detailFormGroup.get('cmoneda')?.enable();
    this.detailFormGroup.get('xmoneda')?.enable();
    this.detailFormGroup.get('xpoliza')?.enable();
    this.detailFormGroup.get('msuma_aseg')?.enable();
    this.detailFormGroup.get('mprima')?.enable();
  }

  cancelEdit(){
    this.values()
    this.edit = true;
    this.detailFormGroup.get('fdesde')?.disable();
    this.detailFormGroup.get('fhasta')?.disable();
    this.detailFormGroup.get('ccedente')?.disable();
    this.detailFormGroup.get('xcedente')?.disable();
    this.detailFormGroup.get('cmoneda')?.disable();
    this.detailFormGroup.get('xmoneda')?.disable();
    this.detailFormGroup.get('xpoliza')?.disable();
    this.detailFormGroup.get('msuma_aseg')?.disable();
    this.detailFormGroup.get('mprima')?.disable();
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
    this.detailFormGroup.get('mprima')?.setValue(event.target.value)
  }

  SumBs(){
    const msuma_aseg_bs = this.msuma_aseg * this.bcv;

    const formattedMsumaAsegBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(msuma_aseg_bs);

    this.msuma_aseg_bs = formattedMsumaAsegBs;
    this.msuma_aseg_bs = this.convertStringToNumber(this.msuma_aseg_bs)
  }

  PrimaBs(){
    const mprima = parseFloat(this.detailFormGroup.get('mprima')?.value);
    
    const mprima_bs = mprima * this.bcv;

    const formattedPriBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(mprima_bs);

    this.mprima_bs = formattedPriBs;
    this.mprima_bs = this.convertStringToNumber(this.mprima_bs)
    this.primaAlterada = true;
    this.receipt()
  }

  convertStringToNumber(str: any): number {
    if (str == null) {
      return 0;
    }
    
    // Asegurarse de que el valor sea una cadena
    const stringValue = String(str);
    
    // Elimina los separadores de miles
    let numberWithoutThousandsSeparator = stringValue.replace(/\./g, '');
    
    // Reemplaza la coma decimal con un punto decimal
    let numberWithDotDecimal = numberWithoutThousandsSeparator.replace(/,/g, '.');
    
    // Convierte el string resultante a número
    let result = parseFloat(numberWithDotDecimal);
    
    // Si parseFloat devuelve NaN, devuelve 0 como valor predeterminado
    return isNaN(result) ? 0 : result;
  }

  onSubmit(){
    let data = {
      id: this.id,
      fdesde_pol: this.detailFormGroup.get('fdesde')?.value,
      fhasta_pol: this.detailFormGroup.get('fhasta')?.value,
      ccedente: this.detailFormGroup.get('ccedente')?.value,
      cmoneda: this.detailFormGroup.get('cmoneda')?.value,
      xpoliza: this.detailFormGroup.get('xpoliza')?.value,
      msumaext: this.convertStringToNumber(this.detailFormGroup.get('msuma_aseg')?.value),
      msuma: this.msuma_aseg_bs,
      mprimaext: parseFloat(this.detailFormGroup.get('mprima')?.value),
      mprima: this.mprima_bs,
      ptasa_cambio: this.bcv
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/update`, data).subscribe((response: any) => {
      if(response.status){
        Swal.fire({
          icon: "success",
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 4000
        }).then((result) => {
          location.reload()
        });
      }
    },(err) => {
      Swal.fire({
        icon: "error",
        title: "Ha ocurrido un Error",
        text: "Estimado usuario, se ha presentado un error inesperado, por favor, contacta al equipo técnico para mayor información",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fdd213d1",
      }).then((result) => {
          if (result.isConfirmed) {
              location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }
}
