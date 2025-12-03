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
  data: any = null
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
  cramo!: any;
  comisionRamo: any;

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
    pcomision_p: [{ value: 0, disabled: false }],
    pcomision_e: [{ value: 0, disabled: false }],
    pcomision_a: [{ value: 0, disabled: false }],
    mcomision_pext: [{ value: 0, disabled: false }],
    mcomision_eext: [{ value: 0, disabled: false }],
    mcomision_aext: [{ value: 0, disabled: false }],
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
            if (this.id && this.currentUser) {
              this.values();
            } 
          }
        });
      })
      .catch(error => {
      });
    }

    
  }

  values(){
    this.http.post(environment.apiUrl + `/api/v1/emission/detail/${this.id}`, {}).subscribe((response: any) => {
      this.data = response.data
      this.cramo = response.data.cramo;
      this.ramo = response.data.xramo;
      this.asegurado = response.data.xnombre;
      this.tomador = response.data.xtomador;

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
      this.renovFormGroup.get('msuma_aseg')?.setValue((response.data.msumaext).toFixed(2));
      this.renovFormGroup.get('mprima')?.setValue((response.data.mprimaext).toFixed(2));

      this.calcularFechaHasta();
      this.searchDistribution();
      this.getTariffs();

      this.format('mprima')
      this.format('msuma_aseg')

      this.updateReceiptData()

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
  }

  formatWithSeparator(formControl:any) {
    let value:any = Number(formControl?.value);
    if(!value) {
      value = 0
    }
    value = (value).toFixed(2);
    formControl?.setValue(value)
  }

  format(formControlName:any){
    const formControl = this.renovFormGroup.get(formControlName)
    this.formatWithSeparator(formControl)

    const monto = Number(formControl?.value)
    const name = formControlName + '_bs'
    console.log(formControlName)

    this[name] = Number((monto * this.bcv).toFixed(2));
    this.calculateComisionMonto()
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
    this.receiptList = [];
    console.log('data',dataCompleta)
    this.http.post(environment.apiUrl + '/api/v1/renovations/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
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
    })
  }
  calculateComisionMonto() {
    const mcomision = Number(((Number(this.renovFormGroup.get('pcomision_p')?.value) /100) * Number(this.renovFormGroup.get('mprima')?.value)).toFixed(2))
    this.renovFormGroup.get('mcomision_pext')?.setValue(mcomision);
    this.formatWithSeparator(this.renovFormGroup.get('mcomision_pext'))
  }
  calculateComisionPorcentaje() {
    const pcomision =  Number(((Number(this.renovFormGroup.get('mcomision_pext')?.value) * 100) / Number(this.renovFormGroup.get('mprima')?.value)).toFixed(2))
    this.renovFormGroup.get('pcomision_p')?.setValue(pcomision);
    this.formatWithSeparator(this.renovFormGroup.get('mcomision_pext'))
  }

  getTariffs(){
    let data = {
      ccedente: this.renovFormGroup.get('ccedente')?.value,
      cramo: this.cramo
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/tariffs`, data).subscribe((response: any) => {
      if(response.status){
        this.comisionRamo = response.pcomision;
        this.renovFormGroup.get('pcomision_p')?.setValue(this.comisionRamo);
        this.calculateComisionMonto()
        if(!this.comisionRamo){
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

  onSubmit(){
    console.log(this.renovFormGroup.getRawValue())
    console.log(this.data)
    const data = {
      ccedente: this.renovFormGroup.get('ccedente')?.value,
      casegurado: this.data.icedula_asegurado,
    }
    
    // {
    //   "ccedente": 73,
    //   "icedula_asegurado": "V",
    //   "xcedula_asegurado": "26666666",
    //   "xnombre_asegurado": "ANDRESITO EL QUE TAL",
    //   "xcorreo_asegurado": null,
    //   "xtelefono_asegurado": "",
    //   "icedula_tomador": "J",
    //   "xcedula_tomador": "31098567-7",
    //   "xnombre_tomador": "     IMPERMEABILIZADORA GRAN CARACAS,C.A \r\n",
    //   "xdireccion_tomador": null,
    //   "xprofesion_tomador": null,
    //   "cestado_tomador": 1,
    //   "cciudad_tomador": "",
    //   "xrif_tomador": "",
    //   "xdomicilio_tomador": null,
    //   "xzona_postal_tomador": "",
    //   "xcorreo_tomador": null,
    //   "cmoneda": 2,
    //   "cramo": 7,
    //   "xpoliza": "185465",
    //   "ccobertura": "",
    //   "fdesde_pol": "2025-12-03",
    //   "fhasta_pol": "2026-12-04",
    //   "femision": "2025-12-03T13:59:42.701Z",
//   "cmetodologiapago": 4,
    //   "ptasa_cambio": 249.1989,
    //   "msuma": 373798.35,
    //   "msumaext": 1500,
    //   "mprima": 37384.82,
    //   "mprimaext": 150.02,
    //   "pcomision": 15,
    //   "mcomision": 5607.72,
    //   "mcomisionext": 22.5,
    //   "cproductor": 1,
    //   "pcomision_p": 15,
    //   "cejecutivo": "",
    //   "pcomision_e": 0,
    //   "cagente": "",
    //   "pcomision_a": "",
    //   "cusuario": 2,
    //   "documentos": []
    // }
  }


}
