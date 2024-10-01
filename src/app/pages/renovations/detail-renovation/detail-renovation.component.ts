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

@Component({
  selector: 'app-detail-renovation',
  templateUrl: './detail-renovation.component.html',
  styleUrls: ['./detail-renovation.component.scss']
})
export class DetailRenovationComponent implements OnInit {

  paginatedList: any[] = [];
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
  bcv!: any;
  moneda!: any;
  cedente!: any;
  poliza!: any;
  fdesdeAnt!: any;
  fhastaAnt!: any;
  fecha!: any;
  xproductor!: any;
  xejecutivo!: any;
  xagente!: any;

  methodOfPaymentList: any[] = [];
  receiptList: any[] = [];

  renovFormGroup = this._formBuilder.group({
    ccedente: [{ value: '', disabled: true }],
    xcedente: [{ value: '', disabled: true }],
    cmoneda: [{ value: '', disabled: true }],
    xmoneda: [{ value: '', disabled: true }],
    fdesde: [{ value: '', disabled: false }],
    fhasta: [{ value: '', disabled: false }],
    xpoliza: [{ value: '', disabled: true }],
    msuma_aseg: [{ value: '', disabled: false }],
    mprima: [{ value: '', disabled: false }],
    cmetodologiapago: [{ value: '', disabled: false }],
    pcomision_p: [{ value: '', disabled: false }],
    pcomision_e: [{ value: '', disabled: false }],
    pcomision_a: [{ value: '', disabled: false }],
    mcomision_pext: [{ value: '', disabled: false }],
    mcomision_eext: [{ value: '', disabled: false }],
    mcomision_aext: [{ value: '', disabled: false }],
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
                 this.router.navigate(['renovations']);
               }else{
                 this.id = this.router.getCurrentNavigation().extras.state.id;       
                 this.fdesde = this.router.getCurrentNavigation().extras.state.fdesde_pol;  
               }
               dateAdapter.setLocale('es');
 
               fetch('https://ve.dolarapi.com/v1/dolares')
               .then((response) => response.json())
               .then(data => {
                 data.forEach((item: any) => {
                   if (item.fuente === 'oficial') {
                     this.bcv = item.promedio;
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
    this.currentUser = JSON.parse(storedSession);

    if (!this.bcv) {
      fetch('https://apisys2000.lamundialdeseguros.com/api/v1/valrep/tasaBCV')
      .then((response) => response.json())
        .then(data => {
          data.data.forEach((item: any) => {
          if (item.cmoneda === '$') {
          this.bcv = item.ptasamon;
          }
        });
      })
      .catch(error => {
      });
    }

    if (this.id && this.currentUser) {
      this.values();
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
      this.cedente = response.data.xcedente
      this.moneda = response.data.xmoneda
      this.poliza = response.data.xpoliza
      this.fdesdeAnt = this.dateUtilService.formatDate(new Date(response.data.fdesde_pol))
      this.fecha = response.data.fdesde_pol

      this.renovFormGroup.get('fdesde')?.setValue(this.dateUtilService.adjustDate(response.data.fhasta_pol))
      this.renovFormGroup.get('ccedente')?.setValue(response.data.ccedente)
      this.renovFormGroup.get('xcedente')?.setValue(response.data.xcedente)
      this.renovFormGroup.get('cmoneda')?.setValue(response.data.cmoneda)
      this.renovFormGroup.get('xmoneda')?.setValue(response.data.xmoneda)
      this.renovFormGroup.get('xpoliza')?.setValue(response.data.xpoliza)
      this.renovFormGroup.get('cmetodologiapago')?.setValue(response.data.cmetodologiapago)
      this.getMethod();
      this.renovFormGroup.get('msuma_aseg')?.setValue(this.formatNumber(response.data.msumaext));
      this.renovFormGroup.get('mprima')?.setValue(this.formatNumber(response.data.mprimaext));

      this.calcularFechaHasta();
      this.updateReceiptData();
      this.searchDistribution();
    })
  }

  formatNumber(value: number | string): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  calcularFechaHasta() {
    const fechaDesde = new Date(this.renovFormGroup.get('fdesde')?.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.renovFormGroup.get('fhasta')?.setValue(fechaHastaISO);
    this.fdesde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());


    const fechaDesdeA = new Date(this.fecha);
    const fechaHastaA = new Date(fechaDesdeA.getFullYear() + 1, fechaDesdeA.getMonth(), fechaDesdeA.getDate() + 1);
    const fechaHastaISOA = fechaHastaA.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'

    this.fhastaAnt = this.dateUtilService.formatDate(fechaHastaA)

    this.updateReceiptData()
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
    this.renovFormGroup.get('mprima')?.setValue(event.target.value)
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
    const mprima = parseFloat(this.renovFormGroup.get('mprima')?.value);
    
    const mprima_bs = mprima * this.bcv;

    const formattedPriBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(mprima_bs);

    this.mprima_bs = formattedPriBs;
    this.mprima_bs = this.convertStringToNumber(this.mprima_bs)
    this.primaAlterada = true;

    this.updateReceiptData();
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

  getMethod(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/method-of-payment', null).subscribe((response: any) => {
      console.log(response)
      this.methodOfPaymentList = response.data.payment.map((item: any) => ({
        id: item.cmetodologiapago,
        value: item.xmetodologiapago
      }))
    })
  }

  updateReceiptData() {
    let dataCompleta = {
      fdesde: this.renovFormGroup.get('fdesde')?.value,
      fhasta: this.renovFormGroup.get('fhasta')?.value,
      mprima: this.renovFormGroup.get('mprima')?.value,
      cmetodologiapago: this.renovFormGroup.get('cmetodologiapago')?.value,
    }
    this.http.post(environment.apiUrl + '/api/v1/renovations/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.data.receipt.map((state: any) => ({
          fdesde_rec: this.dateUtilService.formatDate(new Date(state.fdesde_rec)),
          fhasta_rec: this.dateUtilService.formatDate(new Date(state.fhasta_rec)),
          mprima: state.mprima.toFixed(2),
        }));
      }
    })
  }
  
  searchDistribution(){
    this.http.post(environment.apiUrl + `/api/v1/renovations/distribution/${this.id}`, {}).subscribe((response: any) => {
      this.xproductor = response.distribution.xproductor;
      this.xejecutivo = response.distribution.xejecutivo;
      this.xagente = response.distribution.xagente;

      this.renovFormGroup.get('pcomision_p')?.setValue(response.distribution.pcomision_p);
      this.renovFormGroup.get('pcomision_e')?.setValue(response.distribution.pcomision_e);
      this.renovFormGroup.get('pcomision_a')?.setValue(response.distribution.pcomision_a);

      this.renovFormGroup.get('mcomision_pext')?.setValue(response.distribution.mcomision_pext);
      this.renovFormGroup.get('mcomision_eext')?.setValue(response.distribution.mcomision_eext);
      this.renovFormGroup.get('mcomision_aext')?.setValue(response.distribution.mcomision_aext);
    })
  }

  onSubmit(){

  }

}
