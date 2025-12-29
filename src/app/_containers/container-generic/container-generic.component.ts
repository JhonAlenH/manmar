import {Component, ChangeDetectorRef , Input , OnInit, Inject , SimpleChanges } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateUtilService } from './../../_services/date-util.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-container-generic',
  templateUrl: './container-generic.component.html',
  styleUrls: ['./container-generic.component.scss']
})
export class ContainerGenericComponent implements OnInit {
  public copy: string;
  currentUser!: any

  @Input() receiptData: any;
  Agents: boolean = false;
  activaEliminarEjecutivo: boolean = false;
  activaEliminarAgente: boolean = false;
  commissionSum: any;
  comisionProductor: any;
  comisionEjecutivo: any;
  mcomision_p_bs: any;
  mcomision_e_bs: any;
  mcomision_a_bs: any;
  MontoADistribuir: any;
  selectedAgents: any[] = [];
  comisionesDivididas: any[] = [];


  receiptList: any[] = [];
  executiveList: any[] = [];
  agentsList: any[] = [];  
  documentosList: any = []

  executiveControl = new FormControl('');
  agentsControl = new FormControl('');

  filteredExecutive!: Observable<string[]>;
  filteredAgents!: Observable<string[]>;

  public page = 1;
  public pageSize = 6;

  public pageNotas = 1;
  public pageNotasSize = 5;

  genericFormGroup = this._formBuilder.group({
    cejecutivo: [{ value: '', disabled: false }],
    xejecutivo: [{ value: '', disabled: false }],
    pcomision_e: [{ value: '', disabled: false }],
    mcomision_e: [{ value: '', disabled: true }],
    cagente: [{ value: '', disabled: false }],
    xagente: [{ value: '', disabled: false }],
    pcomision_a: [{ value: '', disabled: false }],
    mcomision_a: [{ value: '', disabled: true }],
    cproductor: [{ value: '', disabled: false }],
    xproductor: [{ value: '', disabled: true }],
    pcomision_p: [{ value: '', disabled: false }],
    mcomision_p: [{ value: '', disabled: true }],
  });

  constructor( private _formBuilder: FormBuilder,
               private http: HttpClient,
               private modalService: NgbModal,
               private dateUtilService: DateUtilService,
               private cdr: ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    // this.getExecutive();
    this.getProducers();
    this.genericFormGroup.valueChanges.subscribe(() => {
      this.commissionSumValidator();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptData) {
      this.updateReceiptData(changes.receiptData.currentValue);
    }
  }

  updateReceiptData(data: any) {
    let dataCompleta = {
      fdesde: data.fdesde,
      fhasta: data.fhasta,
      mprima: data.mprimaext,
      cmetodologiapago: data.cmetodologiapago,
    }
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.data.receipt.map((state: any) => ({
          fdesde_rec: this.dateUtilService.formatDate(new Date(state.fdesde_rec)),
          fhasta_rec: this.dateUtilService.formatDate(new Date(state.fhasta_rec)),
          mprima: state.mprima.toFixed(2),
        }));
      }
    })
    if(data.pcomision) {
      this.genericFormGroup.get('pcomision_p')?.setValue(data.pcomision);
    }
  }

  getProducers(){
    this.http.post(environment.apiUrl + '/api/v1/emission/producers', null).subscribe((response: any) => {
      if (response.status) {
        
        this.genericFormGroup.get('cproductor')?.setValue(response.cproductor);
        this.genericFormGroup.get('xproductor')?.setValue(response.xproductor);

        const mprima = this.receiptData.mprimaext;

        const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    
        const primaCalculada_p = mprima * pcomision_p / 100;
    
        if(pcomision_p != 0){ 
          this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
        }
        let mcomision_bs = primaCalculada_p 
        if(this.receiptData.cmoneda != 1 ) {
          mcomision_bs = primaCalculada_p * this.receiptData.bcv;
        }
        
        // Formatear con separadores de miles y decimales
        this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(mcomision_bs);

        this.MontoADistribuir = primaCalculada_p.toFixed(2);
        this.comisionProductor = response.pcomision
        this.commissionSumValidator();
      }
    });
  }

  commissionSumValidator() {
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    this.commissionSum = pcomision_p;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#334ebd",
      });
    }
  }

  commissionSumValidator2() {
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;

    this.commissionSum = pcomision_p;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#334ebd",
      });
    }else{
      this.calculatePremiums();
    }
  }

  calculatePremiums(){
    const mprima = this.receiptData.mprimaext;
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;

    const primaCalculada_p = mprima * pcomision_p / 100;

    let mcomision_bs = primaCalculada_p 
      this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      if(this.receiptData.cmoneda != 1 ) {
        mcomision_bs = primaCalculada_p * this.receiptData.bcv;
      }
      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(mcomision_bs);

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


  addFile(id:any): void {
    const newImgInput = <HTMLInputElement> document.getElementById(id)
    newImgInput.click()
  }

  addNote(event: any){
    
    const form = new FormData()
    form.append( "file", event.target.files[0], event.target.files[0].name)
    form.append( "fileName", event.target.files[0].name)
    const response = this.http.post(environment.apiUrl + '/api/upload/document/emission', form)
    response.subscribe( data => {
      this.documentosList.push({xarchivo: event.target.files[0].name, xruta: environment.apiUrl + data['data']['url'], xtitulo: '', type: 'create'})      
      const newImgInput = <HTMLInputElement> document.getElementById('newFile')
      newImgInput.value = null

      console.log(this.documentosList);
    });
  }
  
  removeNote(index:any){
    this.documentosList.splice(index, 1)
  }


  onSubmit(){

    const formatDateToString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por lo que sumamos 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const fdesdeString = formatDateToString(new Date(this.receiptData.fdesde));
    const fhastaString = this.receiptData.fhasta;

    let data = {
      ccedente: this.receiptData.ccedente,
      icedula_asegurado: this.receiptData.itipodoc,
      xcedula_asegurado: this.receiptData.xcedula.trim(),
      xnombre_asegurado: this.receiptData.xasegurado.toUpperCase() || null,
      xcorreo_asegurado: this.receiptData.xcorreo_asegurado.toUpperCase() || null,
      xtelefono_asegurado: this.receiptData.xtelefono_asegurado,
      icedula_tomador: this.receiptData.itipodoc_t,
      xcedula_tomador: this.receiptData.xdoc_identificacion_t,
      xnombre_tomador: this.receiptData.xtomador.toUpperCase() || null,
      xdireccion_tomador: this.receiptData.xdireccion.toUpperCase() || null,
      xtelefono_tomador: this.receiptData.xtelefono,
      xprofesion_tomador: this.receiptData.xprofesion.toUpperCase() || null,
      cestado_tomador: this.receiptData.cestado,
      cciudad_tomador: this.receiptData.cciudad,
      xrif_tomador: this.receiptData.xrif,
      xdomicilio_tomador: this.receiptData.xdomicilio.toUpperCase() || null,
      xzona_postal_tomador: this.receiptData.xzona_postal,
      xcorreo_tomador: this.receiptData.xcorreo.toUpperCase() || null,
      cmoneda: this.receiptData.cmoneda,
      cramo: this.receiptData.cramo,
      cproducto: this.receiptData.cproducto,
      xpoliza: this.receiptData.xpoliza,
      fdesde_pol: fdesdeString,
      fhasta_pol: fhastaString,
      femision: new Date(),
      cmetodologiapago: this.receiptData.cmetodologiapago,
      ptasa_cambio: this.receiptData.bcv,
      msuma: this.convertStringToNumber(this.receiptData.msuma),
      msumaext: this.receiptData.msumaext,
      mprima: this.convertStringToNumber(this.receiptData.mprima),
      mprimaext: parseFloat(this.receiptData.mprimaext),
      pcomision: this.convertStringToNumber(this.genericFormGroup.get('pcomision_p')?.value),
      mcomision: this.convertStringToNumber(this.mcomision_p_bs),
      mcomisionext: parseFloat(this.genericFormGroup.get('mcomision_p')?.value),
      cproductor: this.genericFormGroup.get('cproductor')?.value,
      pcomision_p: 100,
      cejecutivo: null,
      pcomision_e: 0,
      cagente: null,
      pcomision_a: 0,
      cusuario: this.currentUser.data.cusuario,
      documentos: this.documentosList
    }

    console.log(data)
        // Validación de campos obligatorios
        const camposObligatorios = {
          ccedente: 'Cédente',
          cmoneda: 'Moneda',
          cramo: 'Ramo',
          xpoliza: 'Póliza',
          fdesde_pol: 'Fecha Desde',
          fhasta_pol: 'Fecha Hasta',
          cmetodologiapago: 'Metodología de Pago',
          msuma: 'Suma Asegurada',
          msumaext: 'Suma Asegurada (Ext)',
          mprima: 'Prima',
          mprimaext: 'Prima (Ext)'
      };
  
      const camposFaltantes = Object.keys(camposObligatorios).filter(campo => !data[campo] || data[campo] === 0);
  
      if (camposFaltantes.length > 0) {
          const nombresCamposFaltantes = camposFaltantes.map(campo => camposObligatorios[campo]).join(', ');
          Swal.fire({
              title: "Por favor, complete los siguientes campos:",
              text: `\n${nombresCamposFaltantes}`,
              icon: "warning",
              confirmButtonText: "<strong>Aceptar</strong>",
              confirmButtonColor: "#5e72e4",
          });
          return;
      }

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return
    }

    this.http.post(environment.apiUrl + `/api/v1/emission/create`, data).subscribe((response: any) => {
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
