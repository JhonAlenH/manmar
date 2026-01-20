import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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
  vigencia!: any;
  fdesdeAnt!: any;
  fhastaAnt!: any;
  fecha!: any;
  xproductor!: any;
  xejecutivo!: any;
  xagente!: any;
  cramo!: any;
  comisionRamo: any;

  methodOfPaymentList: any[] = [];
  productList: any[] = [];
  receiptList: any[] = [];

  renovFormGroup = this._formBuilder.group({
    ccedente: ['', Validators.required],
    casegurado: ['', Validators.required],
    ctomador: ['', Validators.required],
    // xcedente: ['', Validators.required],
    cmoneda: ['', Validators.required],
    // xmoneda: ['', Validators.required],
    fdesde: ['', Validators.required],
    fhasta: ['', Validators.required],
    xpoliza: ['', Validators.required],
    msuma_aseg: ['', Validators.required],
    cramo: ['', Validators.required],
    cproducto: ['', Validators.required],
    mprima: ['', Validators.required],
    cmetodologiapago: ['', Validators.required],
    pcomision: [0, Validators.required],
    mcomision_ext: [0, Validators.required],
  });

  renovLabels = [
    {id: 'ccedente', value:'Código Cedente'},
    // {id: 'xcedente', value:'Cedente'},
    {id: 'cmoneda', value:'Código Moneda'},
    {id: 'xmoneda', value:'Moneda'},
    {id: 'fdesde', value:'Fecha Inicio'},
    {id: 'fhasta', value:'Fecha Fin'},
    {id: 'xpoliza', value:'Nº Póliza'},
    {id: 'msuma_aseg', value:'Suma Asegurada'},
    {id: 'mprima', value:'Prima'},
    {id: 'cmetodologiapago', value:'Metodología de Pago'},
    {id: 'pcomision', value:'Porcentaje de Comisión'},
    {id: 'cproducto', value:'Producto'},
    {id: 'mcomision_ext', value:'Monto de Comisión'},
  ]

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
                 this.id = this.router.getCurrentNavigation().extras.state.poliza?.cpoliza;       
                 this.fdesde = this.router.getCurrentNavigation().extras.state.fdesde_pol;  
               }
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
    this.currentUser = JSON.parse(storedSession);
    this.currentUser = this.currentUser.data.user;

    if (!this.bcv) {
      fetch('https://apisys2000.lamundialdeseguros.com/api/v1/valrep/tasaBCV')
      .then((response) => response.json())
        .then(data => {
          data.data.forEach((item: any) => {
          if (item.cmoneda === '$') {
            this.bcv = Number((item.ptasamon).toFixed(2));
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
      this.asegurado = `${this.data.asegurado?.xnombre} ${this.data.asegurado?.xapellido}`.trim();
      this.tomador = `${this.data.tomador?.xnombre} ${this.data.tomador?.xapellido}`.trim();
      
      this.vigencia = this.data.vigencias[0];
      
      this.cramo = this.vigencia.producto?.ramo?.cramo;
      this.ramo = this.vigencia.producto?.ramo.xramo;
      this.metodologia = this.vigencia.metodologia_pago.xmetodologiapago
      this.cmetodologia = this.vigencia.metodologia_pago.cmetodologia
      this.cedente = this.data.cedente?.persona?.xnombre
      this.moneda = this.vigencia.moneda?.xmoneda
      this.poliza = this.data.xpoliza
      this.xproductor = this.data.productor?.usuario?.persona.xnombre

      this.fdesdeAnt = this.dateUtilService.formatDate(new Date(this.vigencia.fdesde))
      this.fecha = this.vigencia.fdesde
      this.fhastaAnt = this.dateUtilService.formatDate(new Date(this.vigencia.fhasta))

      this.renovFormGroup.get('fdesde')?.setValue(this.vigencia.fhasta)
      this.renovFormGroup.get('ccedente')?.setValue(this.data.cedente.ccedente)
      this.renovFormGroup.get('casegurado')?.setValue(this.data.asegurado.cpersona)
      this.renovFormGroup.get('ctomador')?.setValue(this.data.tomador.cpersona)
      // this.renovFormGroup.get('xcedente')?.setValue(this.data.cedente.xcedente)
      this.renovFormGroup.get('cmoneda')?.setValue(this.vigencia.moneda.cmoneda)
      // this.renovFormGroup.get('xmoneda')?.setValue(this.vigencia.moneda.xmoneda)
      this.renovFormGroup.get('xpoliza')?.setValue(this.data.xpoliza)
      this.renovFormGroup.get('cmetodologiapago')?.setValue(this.vigencia?.metodologia_pago.cmetodologiapago)
      this.renovFormGroup.get('msuma_aseg')?.setValue(this.formatWithSeparator(this.vigencia.msumaext.toFixed(2)));
      this.renovFormGroup.get('mprima')?.setValue(this.formatWithSeparator(this.vigencia.mprimaext.toFixed(2)));
      this.SumBs('mprima');
      this.SumBs('msuma_aseg');
      this.renovFormGroup.get('pcomision')?.setValue((this.vigencia.producto?.pcomision).toFixed(2));
      this.renovFormGroup.get('cproducto')?.setValue(this.vigencia.producto.cproducto);
      this.renovFormGroup.get('cramo')?.setValue(this.vigencia.producto?.ramo?.cramo);
      this.getMethod();
      this.getProduct();

      this.calcularFechaHasta();
      // this.searchDistribution();

      this.updateReceiptData()

    })
  }

  unFormatWithSeparator(value: any) {
    let valueF = value.replaceAll('.', '');
    valueF = valueF.replaceAll(',', '.');
    valueF = Number(valueF)
    valueF = parseFloat(valueF.toFixed(2));
    return valueF;
  }

  onlyFormatWithSeparator(valueTo: any) {
    let value = valueTo;
    if(typeof valueTo !== 'number'){
      value = valueTo.replace(/\D/g, '');
    }
    const formattedValue = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return formattedValue
  }

  formatWithSeparator(valueTo: any) {
    let value = valueTo;
    if(typeof valueTo !== 'number'){
      value = valueTo.replace(/\D/g, '');
    }
    value = (value / 100).toFixed(2);
    const formattedValue = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return formattedValue
  }

  checkFormat(event: any, field:any) {
    let value = this.formatWithSeparator(event.target.value);

    this.renovFormGroup.get(field)?.setValue(value);
  }

  SumBs(formControlName:any) {
    const value = this.renovFormGroup.get(formControlName)?.value
    // this.fixItems(formControl)
    const monto = this.unFormatWithSeparator(value)
    const name = formControlName + '_bs'

    const numberBs = (monto * this.bcv).toFixed(2);
    this[name] = this.formatWithSeparator(numberBs)
    this.calculateComisionMonto()

    /*
    const mprima = this.unFormatWithSeparator(this.renovFormGroup.get('mprima')?.value || '0,00');
    const msuma_aseg = this.unFormatWithSeparator(this.renovFormGroup.get('msuma_aseg')?.value || '0,00');

    let msuma_aseg_bs = msuma_aseg
    let mprima_bs = mprima
    
    if(this.renovFormGroup.get('cmoneda')?.value != '1') {
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
    
    this.renovFormGroup.get('msuma_aseg_bs')?.setValue(formattedMsumaAsegBs || '0,00');
    this.renovFormGroup.get('mprima_bs')?.setValue(formattedPriBs || '0,00');
    
    if(msuma_aseg_bs != 0){
      this.ActivaSumBs = true;
    }

    if(mprima_bs != 0){
      this.ActivaPriBs = true;
    }

    if(msuma_aseg_bs != 0 && mprima_bs != 0){
      this.receipt()
    }
      */
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
    
  }

  fixItems(formControl:any) {
    let value:any = Number(formControl?.value);
    if(!value) {
      value = 0
    }
    value = (value).toFixed(2);
    formControl?.setValue(value)
  }

  format(formControlName:any){
    const value = this.renovFormGroup.get(formControlName)?.value

    const monto = this.unFormatWithSeparator(value)
    const name = formControlName + '_bs'

    const numberBs = Number((monto * this.bcv).toFixed(2));
    this[name] = this.formatWithSeparator(numberBs)
    // this.calculateComisionMonto()
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
    this.methodOfPaymentList = []
    this.http.post(environment.apiUrl + '/api/v1/valrep/method-of-payment', null).subscribe((response: any) => {
      this.methodOfPaymentList = response.data.payment.map((item: any) => ({
        id: item.cmetodologiapago,
        value: item.xmetodologiapago
      }))
    })
  }
  getProduct(){
    let data = {
      cramo: this.renovFormGroup.get('cramo')?.value,
      ccedente: this.renovFormGroup.get('ccedente')?.value,
    }
    this.productList = []
    this.http.post(environment.apiUrl + '/api/v1/valrep/product', data).subscribe((response: any) => {
      this.productList = response.data.product.map((item: any) => ({
        id: item.cproducto,
        value: item.xproducto
      }))
    })
  }
  formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por lo que sumamos 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  adjustDate(dateString: string): string {
    const date = new Date(dateString);
    // date.setDate(date.getDate() + 1); // Adjust date by adding 1 day
    return date.toISOString().split('T')[0]; // Convert back to YYYY-MM-DD format
  }

  updateReceiptData() {
    let dataCompleta = {
      fdesde: this.renovFormGroup.get('fdesde')?.value,
      fhasta: this.renovFormGroup.get('fhasta')?.value,
      mprima: this.unFormatWithSeparator(this.renovFormGroup.get('mprima')?.value),
      pcomision: this.unFormatWithSeparator(this.renovFormGroup.get('pcomision')?.value) /100,
      cmetodologiapago: this.renovFormGroup.get('cmetodologiapago')?.value,
    }
    this.receiptList = [];
    this.http.post(environment.apiUrl + '/api/v1/renovations/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = response.data.receipt.map((receipt: any) => ({
          ncuota: receipt.id,
          fdesde_rec: this.adjustDate(receipt.fdesde_rec),
          fhasta_rec: this.adjustDate(receipt.fhasta_rec),
          ptasamon: this.bcv,
          ctomador: this.renovFormGroup.get('ctomador')?.value,
          msumaaseg: this.unFormatWithSeparator(this.msuma_aseg_bs),
          msumaasegext: this.unFormatWithSeparator(this.renovFormGroup.get('msuma_aseg')?.value),
          mprima: Number((receipt.mprima * this.bcv).toFixed(2)),
          mprimaext: Number(receipt.mprima.toFixed(2)),
          pcomision: this.renovFormGroup.get('pcomision')?.value,
          mcomision: Number((receipt.mcomision * this.bcv).toFixed(2)),
          mcomisionext: Number(receipt.mcomision.toFixed(2)),
          iestadorec: 'P',
          comisiones: [{
            cproductor: this.currentUser.productor.cproductor,
            cmoneda: this.renovFormGroup.get('cmoneda')?.value,
            ptasamon: this.bcv,
            pcomision: this.renovFormGroup.get('pcomision')?.value,
            mcomision: Number((receipt.mcomision * this.bcv).toFixed(2)),
            mcomisionext: Number(receipt.mcomision.toFixed(2)),
            iestado: 'P',
            bactivo: 1,
            cusuario_creacion: this.currentUser.cusuario,
            fcreacion: new Date()
          }]

        // this.receiptList = response.data.receipt.map((state: any) => ({
        //   fdesde_rec: this.dateUtilService.formatDate(new Date(state.fdesde_rec)),
        //   fhasta_rec: this.dateUtilService.formatDate(new Date(state.fhasta_rec)),
        //   mprima: state.mprima.toFixed(2),
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
    const mcomision = Number(((Number(this.renovFormGroup.get('pcomision')?.value) /100) * Number(this.renovFormGroup.get('mprima')?.value)).toFixed(2))
    this.renovFormGroup.get('mcomision_ext')?.setValue(mcomision);
    this.fixItems(this.renovFormGroup.get('mcomision_ext'))
  }
  calculateComisionPorcentaje() {
    const pcomision =  Number(((Number(this.renovFormGroup.get('mcomision_ext')?.value) * 100) / Number(this.renovFormGroup.get('mprima')?.value)).toFixed(2))
    this.renovFormGroup.get('pcomision')?.setValue(pcomision);
    this.fixItems(this.renovFormGroup.get('mcomision_ext'))
  }

  onSubmit(){
    if(this.renovFormGroup.invalid){
      let errors = []
      const values = Object.entries(this.renovFormGroup.value)
      for(const value of values) {
        if(!value[1]) {
          if(this.renovFormGroup.get(value[0])?.errors ) {
            const findedLabel:any = this.renovLabels.find((label:any) => label.id == value[0])
            if(findedLabel) {
              errors.push(findedLabel.value)
            }
          }
        }
      }
      Swal.fire({
        title: "Por favor, complete los siguientes campos:",
        text: `\n${errors.join('\n')}`,
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return
    }
    if(this.renovFormGroup.get('pcomision')?.value > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return
    }
    if(this.unFormatWithSeparator(this.renovFormGroup.get('mprima')?.value) == 0 || this.unFormatWithSeparator(this.renovFormGroup.get('msuma_aseg')?.value) == 0){
      Swal.fire({
        title: "Error en los montos, por favor verificar",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return
    }
    let dataSubmit = {
      cpoliza: this.id,
      cproductor_convenio: this.currentUser.productor.cproductor,
      cmoneda: this.renovFormGroup.get('cmoneda')?.value,
      xpoliza: this.data.xpoliza,
      cproducto: this.renovFormGroup.get('cproducto')?.value,
      fdesde: this.renovFormGroup.get('fdesde')?.value,
      fhasta: this.renovFormGroup.get('fhasta')?.value,
      femision: new Date(),
      cmetodologiapago: this.renovFormGroup.get('cmetodologiapago')?.value,
      iestado: 'V',
      msuma: this.convertStringToNumber(this.msuma_aseg_bs),
      msumaext: this.convertStringToNumber(this.renovFormGroup.get('msuma_aseg')?.value),
      mprima: this.convertStringToNumber(this.mprima_bs),
      mprimaext: this.unFormatWithSeparator(this.renovFormGroup.get('mprima')?.value),
      cusuario: this.currentUser.cusuario,
      recibos: this.receiptList,
      ptasamon: this.bcv,
      pcomision: this.unFormatWithSeparator(this.renovFormGroup.get('pcomision')?.value) / 100,
      documentos: []
    }
    console.log(dataSubmit)
    this.http.post(environment.apiUrl + `/api/v1/renovations/create/${this.id}`, dataSubmit).subscribe((response: any) => {
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
        confirmButtonColor: "#5e72e4",
      }).then((result) => {
        if (result.isConfirmed) {
          // location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
        }
      });
    })
  }



}
